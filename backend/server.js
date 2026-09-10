const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
app.use(cors());
app.use(express.json());

const DEBUG_MODE = true;
const SERIAL_PORT = process.env.SERIAL_PORT || 'COM5';

let isArduinoConnected = false;
let port = null;
let parser = null;

let latestPrediction = {
    sensorData: null,
    prediction: null
};

// Throttle configuration
let lastProcessTime = 0;
const THROTTLE_MS = 1500; // process at most 1 message every 1.5s

function initSerialPort() {
    if (port) {
        if (port.isOpen) port.close();
        port = null;
    }

    port = new SerialPort({ path: SERIAL_PORT, baudRate: 9600 }, (err) => {
        if (err) {
            if (DEBUG_MODE) console.warn(`Serial port ${SERIAL_PORT} not found, retrying in 4s...`);
            isArduinoConnected = false;
            setTimeout(initSerialPort, 4000);
            return;
        }
        isArduinoConnected = true;
        if (DEBUG_MODE) console.log(`USB COM4 SUCCESS -> Listening for Arduino streams...`);
    });

    port.on('open', () => {
        isArduinoConnected = true;
        parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

        parser.on('data', (data) => {
            const line = data.trim();
            if (DEBUG_MODE) console.log("RAW USB TRACE:", line);

            // Looser pattern to accept 'GAS:300,IR:1' OR 'RAW:82|NH3:10|IR:0'
            const valid = line.includes('GAS:') || line.includes('RAW:') || line.includes('IR:');
            if (!valid) {
                if (DEBUG_MODE) console.log("Malformed payload dropped.");
                return; // drop line
            }

            // Debounce / Throttle
            const now = Date.now();
            if (now - lastProcessTime < THROTTLE_MS) {
                return; // drop line if fired too fast
            }
            lastProcessTime = now;

            try {
                const parts = line.includes('|') ? line.split('|') : line.split(',');
                const sensorObj = { GAS: 0, IR: 0, DAYS: 2 };

                parts.forEach(part => {
                    const pair = part.split(':');
                    if (pair.length === 2) {
                        const key = pair[0].trim().toUpperCase();
                        const value = parseInt(pair[1].trim(), 10);
                        if (key === 'GAS' || key === 'RAW') sensorObj.GAS = value;
                        if (key === 'IR') sensorObj.IR = value;
                        if (key === 'DAYS') sensorObj.DAYS = value;
                    }
                });

                const p_gas = sensorObj.GAS;
                const p_ir = sensorObj.IR;
                const p_days = sensorObj.DAYS;

                // Validate ranges safely
                if (isNaN(p_gas) || p_gas < 0 || p_gas > 1023) return;
                if (isNaN(p_ir) || (p_ir !== 0 && p_ir !== 1)) return;
                if (isNaN(p_days) || p_days < 0 || p_days > 365) return;

                const mappedData = {
                    gas_value: p_gas,
                    presence: p_ir,
                    storageDays: p_days
                };

                if (DEBUG_MODE) console.log("CLEAN PARSED JSON:", mappedData);
                runMLPrediction(mappedData);

            } catch (err) {
                if (DEBUG_MODE) console.error("Error parsing verified payload:", err);
            }
        });
    });

    port.on('error', (err) => {
        if (DEBUG_MODE) console.error("USB COM4 Error:", err.message);
        isArduinoConnected = false;
        setTimeout(initSerialPort, 4000);
    });

    port.on('close', () => {
        if (DEBUG_MODE) console.log("USB Disconnected. Auto-reconnecting in 4s...");
        isArduinoConnected = false;
        setTimeout(initSerialPort, 4000);
    });
}

// Start connection sequence
initSerialPort();


// Continuous ML Evaluation
function runMLPrediction(sensorData) {
    const { gas_value, presence, storageDays } = sensorData;

    // SKIP ML IF NO FOOD DETECTED
    if (presence === 0) {
        const noFoodResult = {
            status: "No Food Detected",
            riskScore: 0.0,
            timeRemaining: "N/A",
            recommendation: "Place food sample"
        };
        if (DEBUG_MODE) console.log("ML SKIPPED (No Food):", noFoodResult);
        latestPrediction = {
            sensorData,
            prediction: noFoodResult
        };
        return;
    }

    const pyScript = path.join(__dirname, '..', 'ml', 'predict.py');
    const pythonExec = path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe');
    const pythonProcess = spawn(pythonExec, [pyScript, gas_value, presence, storageDays]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    let errorOutput = '';
    pythonProcess.stderr.on('data', (data) => {
        if (DEBUG_MODE) console.error(`ML stderr: ${data}`);
        errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
        try {
            const mlResult = JSON.parse(dataString);
            if (!mlResult.error) {
                if (DEBUG_MODE) console.log("PYTHON ML RESULT:", mlResult);
                latestPrediction = {
                    sensorData,
                    prediction: mlResult
                };
            } else {
                if (DEBUG_MODE) console.error("Python Error Data:", mlResult.error);
            }
        } catch (e) {
            if (DEBUG_MODE) console.error('JSON Parse Error from Background ML:', e, dataString);
            if (errorOutput.includes("sklearn") || errorOutput.includes("ModuleNotFoundError")) {
                latestPrediction = {
                    sensorData,
                    prediction: {
                        status: "Sensor Active",
                        riskScore: 0,
                        timeRemaining: "N/A",
                        recommendation: "ML environment unavailable"
                    }
                };
            }
        }
    });
}


// Live polling API endpoint
app.get("/latest", (req, res) => {
    if (!isArduinoConnected) {
        return res.json({
            deviceStatus: "disconnected",
            error: "Device not connected"
        });
    }

    res.json({
        deviceStatus: "connected",
        sensorData: latestPrediction.sensorData,
        prediction: latestPrediction.prediction
    });
});

app.post("/predict", (req, res) => {
    if (DEBUG_MODE) console.log("INCOMING REQUEST:", req.body);
    const { gas_value, presence, storageDays } = req.body;

    if (!gas_value || presence === undefined || storageDays === undefined) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const p_gas = Number(gas_value) || 0;
    const p_ir = Number(presence) || 0;
    const p_days = Number(storageDays) || 0;

    if (p_gas < 0 || p_gas > 1023) {
        return res.status(400).json({ error: "Gas value must be between 0 and 1023." });
    }

    if (p_ir === 0) {
        const resp = {
            status: "No Food Detected",
            riskScore: 0.0,
            timeRemaining: "N/A",
            recommendation: "Place food sample"
        };

        latestPrediction = {
            sensorData: req.body,
            prediction: resp
        };
        return res.json(resp);
    }

    const pyScript = path.join(__dirname, '..', 'ml', 'predict.py');
    const pythonExec = path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe');
    const pythonProcess = spawn(pythonExec, [pyScript, p_gas, p_ir, p_days]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        if (DEBUG_MODE) console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        try {
            const mlResult = JSON.parse(dataString);
            if (mlResult.error) {
                return res.status(500).json({ error: "Prediction failed" });
            }
            if (DEBUG_MODE) console.log("API ML RESULT:", mlResult);

            latestPrediction = {
                sensorData: req.body,
                prediction: mlResult
            };

            res.json(mlResult);
        } catch (e) {
            if (DEBUG_MODE) console.error('JSON Parse Error:', e);
            res.status(500).json({ error: "Prediction failed" });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
