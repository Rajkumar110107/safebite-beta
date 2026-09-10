const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

let SerialPort = null;
let ReadlineParser = null;
try {
    const sp = require('serialport');
    SerialPort = sp.SerialPort;
    const parserMod = require('@serialport/parser-readline');
    ReadlineParser = parserMod.ReadlineParser;
} catch (e) {
    console.warn("Serialport module optional load:", e.message);
}

const app = express();
app.use(cors());
app.use(express.json());

const DEBUG_MODE = process.env.DEBUG === 'true' || true;
const SERIAL_PORT = process.env.SERIAL_PORT || 'COM5';

let isArduinoConnected = false;
let port = null;
let parser = null;

let latestPrediction = {
    sensorData: { gas_value: 140, presence: 1, storageDays: 1 },
    prediction: {
        status: "Fresh",
        condition: "FRESH",
        riskScore: 0.05,
        foodConditionScore: 95,
        confidence: "98%",
        timeRemaining: "20 hours (Estimated)",
        primaryIndicator: "Baseline ambient VOC levels within fresh threshold",
        recommendation: "Condition screening indicates optimal freshness. Safe to consume and store."
    }
};

// Locate best available python executable
function getPythonExecutable() {
    const venvPython = path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe');
    const dotVenvPython = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');
    if (fs.existsSync(venvPython)) return venvPython;
    if (fs.existsSync(dotVenvPython)) return dotVenvPython;
    return 'python';
}

// Throttle configuration
let lastProcessTime = 0;
const THROTTLE_MS = 1500;

function initSerialPort() {
    if (!SerialPort) {
        console.log("SerialPort library not available. Running in simulated API bridge mode.");
        return;
    }

    if (port) {
        try {
            if (port.isOpen) port.close();
        } catch (e) {}
        port = null;
    }

    try {
        port = new SerialPort({ path: SERIAL_PORT, baudRate: 9600 }, (err) => {
            if (err) {
                if (DEBUG_MODE) console.log(`Serial port ${SERIAL_PORT} not connected (Standby / Simulation ready). Retrying in 5s...`);
                isArduinoConnected = false;
                setTimeout(initSerialPort, 5000);
                return;
            }
            isArduinoConnected = true;
            if (DEBUG_MODE) console.log(`USB COM Port (${SERIAL_PORT}) connected. Listening for Arduino telemetry stream...`);
        });

        port.on('open', () => {
            isArduinoConnected = true;
            if (ReadlineParser) {
                parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
                parser.on('data', (data) => {
                    const line = data.trim();
                    if (DEBUG_MODE) console.log("RAW SERIAL TRACE:", line);

                    const valid = line.includes('GAS:') || line.includes('RAW:') || line.includes('IR:') || line.includes('STATUS:');
                    if (!valid) return;

                    const now = Date.now();
                    if (now - lastProcessTime < THROTTLE_MS) return;
                    lastProcessTime = now;

                    try {
                        const parts = line.includes('|') ? line.split('|') : line.split(',');
                        const sensorObj = { GAS: 140, IR: 1, DAYS: 1 };

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

                        const mappedData = {
                            gas_value: sensorObj.GAS,
                            presence: sensorObj.IR,
                            storageDays: sensorObj.DAYS
                        };

                        runMLPrediction(mappedData);
                    } catch (err) {
                        if (DEBUG_MODE) console.error("Error parsing telemetry payload:", err);
                    }
                });
            }
        });

        port.on('error', (err) => {
            isArduinoConnected = false;
            setTimeout(initSerialPort, 5000);
        });

        port.on('close', () => {
            isArduinoConnected = false;
            setTimeout(initSerialPort, 5000);
        });
    } catch (e) {
        isArduinoConnected = false;
        setTimeout(initSerialPort, 5000);
    }
}

// Start connection attempt gracefully
initSerialPort();

// Continuous ML Evaluation
function runMLPrediction(sensorData, category = "General") {
    const { gas_value, presence, storageDays } = sensorData;

    if (presence === 0) {
        const noFoodResult = {
            status: "No Food Detected",
            condition: "NO_SAMPLE",
            riskScore: 0.0,
            foodConditionScore: 100,
            confidence: "100%",
            timeRemaining: "N/A",
            primaryIndicator: "IR sensor clear",
            recommendation: "Place food sample on sensor stage."
        };
        latestPrediction = { sensorData, prediction: noFoodResult };
        return;
    }

    const pyScript = path.join(__dirname, '..', 'ml', 'predict.py');
    const pythonExec = getPythonExecutable();
    const pythonProcess = spawn(pythonExec, [pyScript, gas_value, presence, storageDays, category]);

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.on('close', () => {
        try {
            const mlResult = JSON.parse(dataString);
            if (!mlResult.error) {
                latestPrediction = { sensorData, prediction: mlResult };
            }
        } catch (e) {
            // Fallback object if parse fails
        }
    });
}

// REST Endpoints
app.get("/latest", (req, res) => {
    res.json({
        deviceStatus: isArduinoConnected ? "connected" : "disconnected",
        sensorData: latestPrediction.sensorData,
        prediction: latestPrediction.prediction
    });
});

app.post("/predict", (req, res) => {
    const { gas_value, presence, storageDays, category } = req.body;

    const p_gas = Number(gas_value) !== undefined ? Number(gas_value) : 140;
    const p_ir = presence !== undefined ? Number(presence) : 1;
    const p_days = storageDays !== undefined ? Number(storageDays) : 1;
    const p_cat = category || "General";

    const pyScript = path.join(__dirname, '..', 'ml', 'predict.py');
    const pythonExec = getPythonExecutable();
    const pythonProcess = spawn(pythonExec, [pyScript, p_gas, p_ir, p_days, p_cat]);

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.on('close', () => {
        try {
            const mlResult = JSON.parse(dataString);
            latestPrediction = {
                sensorData: { gas_value: p_gas, presence: p_ir, storageDays: p_days },
                prediction: mlResult
            };
            res.json(mlResult);
        } catch (e) {
            // Calibration fallback
            const isSpoiled = p_gas > 450 || p_days >= 4;
            const isWarning = p_gas > 200 || p_days >= 2;
            const fallback = {
                status: isSpoiled ? "Spoiled" : isWarning ? "Consume Soon" : "Fresh",
                condition: isSpoiled ? "SPOILED" : isWarning ? "CONSUME_SOON" : "FRESH",
                riskScore: isSpoiled ? 0.95 : isWarning ? 0.5 : 0.05,
                foodConditionScore: isSpoiled ? 5 : isWarning ? 50 : 95,
                confidence: "95%",
                timeRemaining: isSpoiled ? "0 hours (Estimated)" : isWarning ? "< 12 hours (Estimated)" : "24 hours (Estimated)",
                primaryIndicator: isSpoiled ? "Elevated volatile gas signature" : isWarning ? "Moderate VOC gas activity" : "Baseline ambient VOC levels",
                recommendation: isSpoiled ? "Screening indicates spoilage risk. Do not consume." : isWarning ? "Consume soon or refrigerate." : "Safe to consume and store."
            };
            res.json(fallback);
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SafeBite Backend API & ML bridge running on http://localhost:${PORT}`);
});
