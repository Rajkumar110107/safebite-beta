import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Hardware() {
    // Connection & Web Serial State
    const [isConnected, setIsConnected] = useState(false);
    const [portInfo, setPortInfo] = useState('');
    const [connectionError, setConnectionError] = useState('');
    const [isSerialSupported, setIsSerialSupported] = useState(true);

    // Hardware State Machine: 'WAITING_FOR_FOOD' | 'CLASSIFIED_LOCKED' | 'FOOD_REMOVED_WAITING_RESET'
    const [cycleState, setCycleState] = useState('WAITING_FOR_FOOD');
    const [lockedClassification, setLockedClassification] = useState(null); // null | 'FRESH' | 'WARNING' | 'SPOILED'

    // Sensor & Telemetry State
    const [gasResponse, setGasResponse] = useState(65); // baseline ambient reading
    const [foodPresence, setFoodPresence] = useState(0); // 0 = No Food (IR HIGH), 1 = Food Detected (IR LOW)
    const [storageDays, setStorageDays] = useState(1);
    const [riskScore, setRiskScore] = useState(0);
    const [freshnessStatus, setFreshnessStatus] = useState('Ready / Place Food');
    const [recommendation, setRecommendation] = useState('System ready. Place food sample on sensor stage to initiate locked detection cycle.');

    // Hardware Twin State (Physical Pin Mirrors)
    const [ledGreen, setLedGreen] = useState(false);   // Pin D13
    const [ledYellow, setLedYellow] = useState(false); // Pin D6
    const [ledRed, setLedRed] = useState(false);       // Pin D7
    const [lcdLine1, setLcdLine1] = useState('   SAFE BITE    ');
    const [lcdLine2, setLcdLine2] = useState('READY/PLACE FOOD');
    const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);

    // Activity Log
    const [logEntries, setLogEntries] = useState([
        { time: new Date().toLocaleTimeString(), text: 'SafeBite Hardware Interface initialized. 9600 Baud ready.', type: 'info' },
        { time: new Date().toLocaleTimeString(), text: 'System state: WAITING_FOR_FOOD. LEDs OFF. Awaiting IR trigger.', type: 'success' }
    ]);

    // Refs for non-blocking asynchronous Web Serial reading & state synchronization
    const portRef = useRef(null);
    const readerRef = useRef(null);
    const keepReadingRef = useRef(false);
    const lastRxTimeRef = useRef(0);
    const cycleStateRef = useRef(cycleState);
    const lockedClassificationRef = useRef(lockedClassification);
    const previousIRRef = useRef(0);

    useEffect(() => {
        cycleStateRef.current = cycleState;
    }, [cycleState]);

    useEffect(() => {
        lockedClassificationRef.current = lockedClassification;
    }, [lockedClassification]);

    // Check browser Web Serial support
    useEffect(() => {
        if (!('serial' in navigator)) {
            setIsSerialSupported(false);
        }

        const handleUsbDisconnect = () => {
            handleDisconnect();
            addLog('Hardware USB connection lost.', 'warning');
        };

        if ('serial' in navigator) {
            navigator.serial.addEventListener('disconnect', handleUsbDisconnect);
        }

        return () => {
            if ('serial' in navigator) {
                navigator.serial.removeEventListener('disconnect', handleUsbDisconnect);
            }
        };
    }, []);

    // Watchdog to verify telemetry stream freshness
    useEffect(() => {
        const interval = setInterval(() => {
            if (isLiveStreamActive && Date.now() - lastRxTimeRef.current > 3500) {
                setIsLiveStreamActive(false);
                addLog('Hardware stream paused. Telemetry standby.', 'warning');
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [isLiveStreamActive]);

    // Ambient Gas Micro-Variation when in standby/presentation
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isLiveStreamActive) {
                setGasResponse((prev) => {
                    const jitter = Math.round(Math.random() * 4 - 2);
                    let baseTarget = 65;
                    if (cycleState === 'CLASSIFIED_LOCKED' || cycleState === 'FOOD_REMOVED_WAITING_RESET') {
                        if (lockedClassification === 'FRESH') baseTarget = 145;
                        else if (lockedClassification === 'WARNING') baseTarget = 340;
                        else if (lockedClassification === 'SPOILED') baseTarget = 730;
                    }
                    const nextVal = Math.max(20, Math.min(1023, prev + jitter));
                    if (Math.abs(nextVal - baseTarget) > 30) return baseTarget;
                    return nextVal;
                });
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [cycleState, lockedClassification, isLiveStreamActive]);

    const addLog = useCallback((text, type = 'info') => {
        const time = new Date().toLocaleTimeString();
        setLogEntries((prev) => [{ time, text, type }, ...prev.slice(0, 39)]);
    }, []);

    // Helper: Send Serial Command asynchronously without blocking
    const sendSerialCommand = async (cmd) => {
        if (portRef.current && portRef.current.writable) {
            let writer = null;
            try {
                const encoder = new TextEncoder();
                writer = portRef.current.writable.getWriter();
                await writer.write(encoder.encode(`${cmd}\n`));
                addLog(`TX Command -> ${cmd}`, 'info');
            } catch (err) {
                console.warn('Failed to transmit serial command:', err);
                addLog(`Serial TX failed: ${err.message}`, 'error');
            } finally {
                if (writer) {
                    try {
                        writer.releaseLock();
                    } catch (e) {
                        console.warn('Error releasing writer lock:', e);
                    }
                }
            }
        }
    };

    // Apply Classification & Lock Output (Immediate UI + Virtual Twin response)
    const applyClassificationLock = (mode, gasVal) => {
        setCycleState('CLASSIFIED_LOCKED');
        setLockedClassification(mode);
        setFoodPresence(1);
        previousIRRef.current = 1;

        if (mode === 'FRESH') {
            setGasResponse(gasVal || 145);
            setStorageDays(1);
            setRiskScore(12);
            setFreshnessStatus('Fresh');
            setRecommendation('Optimal freshness • Low VOC volatile baseline • Safe to consume');
            setLedGreen(true);
            setLedYellow(false);
            setLedRed(false);
            setLcdLine1('   SAFE BITE    ');
            setLcdLine2(' STATUS: FRESH  ');
            addLog(`Classification Locked: FRESH | Green LED (D13) ON`, 'success');
        } else if (mode === 'WARNING') {
            setGasResponse(gasVal || 340);
            setStorageDays(2);
            setRiskScore(54);
            setFreshnessStatus('Warning');
            setRecommendation('Approaching threshold • Moderate gas emission • Consume soon');
            setLedGreen(false);
            setLedYellow(true);
            setLedRed(false);
            setLcdLine1('   SAFE BITE    ');
            setLcdLine2('STATUS: WARNING ');
            addLog(`Classification Locked: WARNING | Yellow LED (D6) ON`, 'warning');
        } else if (mode === 'SPOILED') {
            setGasResponse(gasVal || 730);
            setStorageDays(4);
            setRiskScore(95);
            setFreshnessStatus('Spoiled');
            setRecommendation('Elevated decomposition gases detected • Not safe for consumption');
            setLedGreen(false);
            setLedYellow(false);
            setLedRed(true);
            setLcdLine1('   SAFE BITE    ');
            setLcdLine2('STATUS: SPOILED ');
            addLog(`Classification Locked: SPOILED | Red LED (D7) ON`, 'error');
        }
    };

    // Local Web UI Reset ONLY - Clears React state, NEVER sends CMD:RESET over serial
    const clearWebStateToReady = () => {
        setCycleState('WAITING_FOR_FOOD');
        setLockedClassification(null);
        setFoodPresence(0);
        previousIRRef.current = 0;
        setGasResponse(65);
        setStorageDays(1);
        setRiskScore(0);
        setFreshnessStatus('Ready / Place Food');
        setRecommendation('System ready. Place food sample on sensor stage to initiate locked detection cycle.');

        // Turn all virtual LEDs OFF
        setLedGreen(false);
        setLedYellow(false);
        setLedRed(false);

        // LCD Returns to Ready
        setLcdLine1('   SAFE BITE    ');
        setLcdLine2('READY/PLACE FOOD');
    };

    // User Explicit Button Click - The ONLY place where CMD:RESET is transmitted
    const handleUserExplicitReset = async () => {
        clearWebStateToReady();
        await sendSerialCommand('CMD:RESET');
    };

    // Demonstration Command Handlers (🟢 FRESH, 🟡 WARNING, 🔴 SPOILED)
    const handleCommandFresh = () => {
        applyClassificationLock('FRESH', 145);
        sendSerialCommand('CMD:FRESH');
    };

    const handleCommandWarning = () => {
        applyClassificationLock('WARNING', 340);
        sendSerialCommand('CMD:WARNING');
    };

    const handleCommandSpoiled = () => {
        applyClassificationLock('SPOILED', 730);
        sendSerialCommand('CMD:SPOILED');
    };

    // Simulate IR Food Placement / Removal for Demonstration
    const handlePlaceFoodIR = (mode) => {
        let gasVal = 145;
        if (mode === 'WARNING') gasVal = 340;
        if (mode === 'SPOILED') gasVal = 730;
        applyClassificationLock(mode, gasVal);
        sendSerialCommand(`CMD:${mode}`);
    };

    const handleRemoveFoodIR = () => {
        setFoodPresence(0);
        previousIRRef.current = 0;
        if (cycleState === 'CLASSIFIED_LOCKED') {
            setCycleState('FOOD_REMOVED_WAITING_RESET');
            addLog('IR: Sample removed. Classification remains locked until RESET is triggered.', 'info');
        } else {
            addLog('IR: Sensor clear (No food detected).', 'info');
        }
    };

    // Web Serial Connect Handler (NO automatic reset sent)
    const handleConnect = async () => {
        setConnectionError('');

        if (!('serial' in navigator)) {
            setConnectionError('Web Serial API is not supported in this browser. Please use Chrome, Edge, or a Chromium-based browser.');
            return;
        }

        try {
            addLog('Opening USB COM-port selection dialog...', 'info');
            const port = await navigator.serial.requestPort();

            await port.open({ baudRate: 9600 });
            portRef.current = port;
            keepReadingRef.current = true;
            setIsConnected(true);

            // Fetch USB metadata if available
            const info = port.getInfo ? port.getInfo() : {};
            const vid = info.usbVendorId ? `0x${info.usbVendorId.toString(16).padStart(4, '0').toUpperCase()}` : '0x2341';
            const pid = info.usbProductId ? `0x${info.usbProductId.toString(16).padStart(4, '0').toUpperCase()}` : '0x0043';
            setPortInfo(`COM Port [VID:${vid} PID:${pid}] 9600 Baud`);

            addLog(`Connected to Arduino COM Port at 9600 Baud. Asynchronous telemetry reader started.`, 'success');

            // Start non-blocking asynchronous stream reading
            readSerialStream(port);

        } catch (err) {
            console.warn('Web Serial connection event:', err);
            if (err.name === 'NotFoundError') {
                addLog('COM-port selection was cancelled by user.', 'info');
            } else {
                setConnectionError(err.message || 'Failed to open COM port.');
                addLog(`Connection error: ${err.message}`, 'error');
            }
            setIsConnected(false);
        }
    };

    // Non-blocking Asynchronous Serial Stream Reader
    const readSerialStream = async (port) => {
        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable).catch(() => {});
        const reader = textDecoder.readable.getReader();
        readerRef.current = reader;

        let lineBuffer = '';

        try {
            while (port.readable && keepReadingRef.current) {
                const { value, done } = await reader.read();
                if (done) break;

                if (value) {
                    lineBuffer += value;
                    const lines = lineBuffer.split('\n');
                    lineBuffer = lines.pop(); // Keep uncompleted line in buffer

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed.length > 0) {
                            parseIncomingTelemetry(trimmed);
                        }
                    }
                }
            }
        } catch (err) {
            if (keepReadingRef.current) {
                console.warn('Serial reader interrupted:', err);
                addLog(`Serial stream interrupted: ${err.message}`, 'error');
            }
        } finally {
            try {
                reader.releaseLock();
            } catch (e) {}
        }
    };

    // Parse Arduino Telemetry Packets & Verbatim Status Strings
    const parseIncomingTelemetry = (line) => {
        lastRxTimeRef.current = Date.now();
        setIsLiveStreamActive(true);

        // 1. Reset Events from physical button or Arduino boot (DO NOT send CMD:RESET back!)
        if (line === 'RESET PRESSED' || line === 'SYSTEM READY' || line.startsWith('RESET:1') || line === 'SAFE BITE READY' || line === 'STATUS: READY' || line === 'STATUS:READY') {
            clearWebStateToReady();
            addLog(`[Arduino]: ${line}`, 'info');
            return;
        }

        // 2. Direct Status Classifications from Arduino
        if (line === 'STATUS: FRESH' || line.endsWith('STATUS: FRESH')) {
            applyClassificationLock('FRESH', 145);
            addLog(`[Arduino]: STATUS: FRESH (Green LED D13 ON)`, 'success');
            return;
        }
        if (line === 'STATUS: WARNING' || line.endsWith('STATUS: WARNING')) {
            applyClassificationLock('WARNING', 340);
            addLog(`[Arduino]: STATUS: WARNING (Yellow LED D6 ON)`, 'warning');
            return;
        }
        if (line === 'STATUS: SPOILED' || line.endsWith('STATUS: SPOILED')) {
            applyClassificationLock('SPOILED', 730);
            addLog(`[Arduino]: STATUS: SPOILED (Red LED D7 ON)`, 'error');
            return;
        }

        // 3. IR Presence Events from Arduino Serial output
        if (line === 'FOOD DETECTED') {
            setFoodPresence(1);
            previousIRRef.current = 1;
            addLog('[Arduino]: FOOD DETECTED (IR LOW)', 'info');
            return;
        }
        if (line === 'FOOD REMOVED') {
            setFoodPresence(0);
            previousIRRef.current = 0;
            if (cycleStateRef.current === 'CLASSIFIED_LOCKED') {
                setCycleState('FOOD_REMOVED_WAITING_RESET');
            }
            addLog('[Arduino]: FOOD REMOVED (IR HIGH) • Locked result preserved', 'info');
            // CRITICAL: NEVER RESET ON FOOD REMOVAL
            return;
        }

        // 4. Structured Telemetry Packets (e.g. GAS:xxx,IR:x,DAYS:x,STATUS:xxx)
        if (line.includes('GAS:') || line.includes('IR:')) {
            const parts = line.includes('|') ? line.split('|') : line.split(',');
            let gas = gasResponse;
            let ir = foodPresence;
            let days = storageDays;
            let status = null;
            let lock = null;

            parts.forEach((part) => {
                const pair = part.split(':');
                if (pair.length === 2) {
                    const key = pair[0].trim().toUpperCase();
                    const val = pair[1].trim();
                    if (key === 'GAS' || key === 'RAW') gas = parseInt(val, 10);
                    if (key === 'IR') ir = parseInt(val, 10);
                    if (key === 'DAYS') days = parseInt(val, 10);
                    if (key === 'STATUS') status = val.toUpperCase();
                    if (key === 'LOCK') lock = parseInt(val, 10);
                }
            });

            if (!isNaN(gas)) setGasResponse(gas);
            if (!isNaN(days)) setStorageDays(days);

            const prevIR = previousIRRef.current;
            const currentCState = cycleStateRef.current;
            const currentLock = lockedClassificationRef.current;

            // Handle IR transition strictly
            if (!isNaN(ir)) {
                if (prevIR === 0 && ir === 1) {
                    // NEW FOOD DETECTED (0 -> 1 transition)
                    previousIRRef.current = 1;
                    setFoodPresence(1);
                    addLog('Physical IR: Food Detected (IR:1)', 'info');

                    if (currentCState === 'WAITING_FOR_FOOD') {
                        if (status && status !== 'READY') {
                            applyClassificationLock(status, gas);
                        } else {
                            if (gas < 200) applyClassificationLock('FRESH', gas);
                            else if (gas <= 450) applyClassificationLock('WARNING', gas);
                            else applyClassificationLock('SPOILED', gas);
                        }
                    }
                } else if (prevIR === 1 && ir === 0) {
                    // FOOD REMOVED (1 -> 0 transition)
                    previousIRRef.current = 0;
                    setFoodPresence(0);
                    if (currentCState === 'CLASSIFIED_LOCKED') {
                        setCycleState('FOOD_REMOVED_WAITING_RESET');
                    }
                    addLog('Physical IR: Food Removed (IR:0) • Result remains locked', 'info');
                    // CRITICAL: NEVER RESET OR RECLASSIFY ON FOOD REMOVAL
                } else {
                    setFoodPresence(ir);
                }
            }

            // Hardware reports locked state
            if (lock === 1 && status && status !== 'READY') {
                if (currentLock !== status) {
                    applyClassificationLock(status, gas);
                }
            }

            addLog(`RX Telemetry: ${line}`, 'info');
        } else {
            addLog(`[Arduino]: ${line}`, 'info');
        }
    };

    // Safe Disconnect Handler
    const handleDisconnect = async () => {
        keepReadingRef.current = false;
        if (readerRef.current) {
            try {
                await readerRef.current.cancel();
            } catch (e) {}
        }
        if (portRef.current) {
            try {
                await portRef.current.close();
            } catch (e) {}
            portRef.current = null;
        }
        setIsConnected(false);
        setIsLiveStreamActive(false);
        setPortInfo('');
        addLog('Web Serial connection closed safely.', 'info');
    };

    // Dynamic Visual Styling
    const getStatusTheme = () => {
        if (freshnessStatus === 'Spoiled') {
            return {
                badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
                textColor: 'text-rose-600',
                gradient: 'from-rose-500 to-rose-700',
                glow: 'shadow-[0_0_24px_rgba(225,29,72,0.35)]',
                icon: 'dangerous',
                border: 'border-rose-300'
            };
        }
        if (freshnessStatus === 'Warning') {
            return {
                badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
                textColor: 'text-amber-600',
                gradient: 'from-amber-500 to-amber-600',
                glow: 'shadow-[0_0_24px_rgba(245,158,11,0.35)]',
                icon: 'warning',
                border: 'border-amber-300'
            };
        }
        if (freshnessStatus === 'Fresh') {
            return {
                badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
                textColor: 'text-emerald-600',
                gradient: 'from-emerald-500 to-emerald-700',
                glow: 'shadow-[0_0_24px_rgba(16,185,129,0.35)]',
                icon: 'check_circle',
                border: 'border-emerald-300'
            };
        }
        return {
            badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
            textColor: 'text-slate-500',
            gradient: 'from-slate-500 to-slate-700',
            glow: 'shadow-none',
            icon: 'sensors',
            border: 'border-slate-200'
        };
    };

    const theme = getStatusTheme();

    return (
        <div className="pt-20 px-4 sm:px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-8 font-body transition-colors duration-200">
            
            {/* Header & Connectivity Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
                            <span className="material-symbols-outlined text-2xl">developer_board</span>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
                                SafeBite Hardware Controller
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Web Serial USB Communication • 9600 Baud • Deterministic Locked Detection
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* State Machine Status Badge */}
                    <div className="px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className={`w-2.5 h-2.5 rounded-full ${cycleState === 'WAITING_FOR_FOOD' ? 'bg-emerald-500 animate-pulse' : cycleState === 'CLASSIFIED_LOCKED' ? 'bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-amber-500'}`}></span>
                        <span className="font-mono uppercase text-slate-800 dark:text-slate-200 tracking-wide">
                            {cycleState === 'WAITING_FOR_FOOD' ? 'READY (WAITING FOOD)' : cycleState === 'CLASSIFIED_LOCKED' ? 'RESULT LOCKED' : 'AWAITING RESET'}
                        </span>
                    </div>

                    {/* Web Serial Connect / Disconnect Button */}
                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
                            className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-700/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-xs cursor-pointer outline-none"
                        >
                            <span className="material-symbols-outlined text-base">usb</span>
                            CONNECT TO HARDWARE
                        </button>
                    ) : (
                        <button
                            onClick={handleDisconnect}
                            className="bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold px-5 py-2.5 rounded-full border border-rose-200 dark:border-rose-800 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-xs cursor-pointer outline-none shadow-sm"
                        >
                            <span className="material-symbols-outlined text-base">link_off</span>
                            DISCONNECT ({portInfo || 'COM'})
                        </button>
                    )}
                </div>
            </div>

            {/* Connection Warning or Browser Info */}
            {!isSerialSupported && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
                    <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
                    <span>Web Serial API is supported in Chrome, Edge, and Opera. On other browsers, use the hardware demonstration controls below.</span>
                </div>
            )}

            {connectionError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-900 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-600 text-lg">error</span>
                        <span>{connectionError}</span>
                    </div>
                    <button onClick={() => setConnectionError('')} className="text-rose-700 font-bold text-xs underline cursor-pointer">Dismiss</button>
                </div>
            )}

            {/* THREE HARDWARE DEMONSTRATION COMMANDS (PRIMARY PRESENTATION SECTION) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-7 rounded-3xl shadow-xl border border-slate-700 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <h3 className="text-base font-black font-headline tracking-wide uppercase text-slate-100">
                                Hardware Demonstration Controls
                            </h3>
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-1">
                            Direct serial transmission triggers physical Arduino LEDs (D13, D6, D7), Parallel LCD (1602A), and locked classification.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {isConnected ? 'USB COM ACTIVE (9600)' : 'STANDBY READY'}
                        </span>
                    </div>
                </div>

                {/* The Three Demonstration Buttons + Explicit Reset Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 🟢 FRESH COMMAND */}
                    <button
                        onClick={handleCommandFresh}
                        className={`p-4 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer outline-none border text-center ${
                            lockedClassification === 'FRESH' && cycleState === 'CLASSIFIED_LOCKED'
                                ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400/50 scale-[1.02]'
                                : 'bg-slate-800/80 border-slate-700 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-500/50'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
                            <span className="text-sm font-black tracking-wide text-white">FRESH</span>
                        </div>
                        <span className="text-[10px] text-slate-300 font-mono">CMD:FRESH • D13 Green ON</span>
                    </button>

                    {/* 🟡 WARNING COMMAND */}
                    <button
                        onClick={handleCommandWarning}
                        className={`p-4 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer outline-none border text-center ${
                            lockedClassification === 'WARNING' && cycleState === 'CLASSIFIED_LOCKED'
                                ? 'bg-amber-600/90 border-amber-400 text-white shadow-lg shadow-amber-600/40 ring-2 ring-amber-400/50 scale-[1.02]'
                                : 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-amber-950/40 hover:border-amber-500/50'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]"></span>
                            <span className="text-sm font-black tracking-wide text-white">WARNING</span>
                        </div>
                        <span className="text-[10px] text-slate-300 font-mono">CMD:WARNING • D6 Yellow ON</span>
                    </button>

                    {/* 🔴 SPOILED COMMAND */}
                    <button
                        onClick={handleCommandSpoiled}
                        className={`p-4 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer outline-none border text-center ${
                            lockedClassification === 'SPOILED' && cycleState === 'CLASSIFIED_LOCKED'
                                ? 'bg-rose-600/90 border-rose-400 text-white shadow-lg shadow-rose-600/40 ring-2 ring-rose-400/50 scale-[1.02]'
                                : 'bg-slate-800/80 border-slate-700 text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/50'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]"></span>
                            <span className="text-sm font-black tracking-wide text-white">SPOILED</span>
                        </div>
                        <span className="text-[10px] text-slate-300 font-mono">CMD:SPOILED • D7 Red ON</span>
                    </button>

                    {/* 🔄 EXPLICIT USER RESET BUTTON */}
                    <button
                        onClick={handleUserExplicitReset}
                        className="p-4 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer outline-none border bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600 text-center"
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-teal-400">restart_alt</span>
                            <span className="text-sm font-black tracking-wide text-white">RESET SYSTEM</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">CMD:RESET • LEDs OFF</span>
                    </button>
                </div>

                {/* Secondary IR Sensor Demonstration Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                    <span className="font-medium">Sensor Stage IR Simulation:</span>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => handlePlaceFoodIR('FRESH')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium text-[11px] cursor-pointer transition-all"
                        >
                            + Place Fresh Item
                        </button>
                        <button
                            onClick={() => handlePlaceFoodIR('WARNING')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-[11px] cursor-pointer transition-all"
                        >
                            + Place Warning Item
                        </button>
                        <button
                            onClick={() => handlePlaceFoodIR('SPOILED')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium text-[11px] cursor-pointer transition-all"
                        >
                            + Place Spoiled Item
                        </button>
                        <button
                            onClick={handleRemoveFoodIR}
                            disabled={foodPresence === 0}
                            className={`px-3 py-1.5 rounded-xl font-medium text-[11px] transition-all ${
                                foodPresence === 0 ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
                            }`}
                        >
                            - Remove Item
                        </button>
                    </div>
                </div>
            </div>

            {/* HARDWARE TWIN & LIVE TELEMETRY MATRIX */}
            <div className="grid grid-cols-12 gap-8">
                
                {/* Physical Hardware Twin Preview (LEDs + 16x2 Parallel LCD) */}
                <div className="col-span-12 lg:col-span-4 bg-[#0d1527] text-white p-7 rounded-3xl shadow-xl border border-slate-800 flex flex-col justify-between space-y-6">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-400 text-xl">memory</span>
                                <span className="font-headline font-black text-sm tracking-wider text-slate-100">ARDUINO HARDWARE TWIN</span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                                {isConnected ? 'COM CONNECTED' : 'READY'}
                            </span>
                        </div>

                        {/* Physical Indicator LEDs Panel (Verified D13, D6, D7) */}
                        <div className="mt-5 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physical Output LEDs</p>
                                <span className="text-[9px] font-mono text-slate-500">Verified Pinout</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                {/* Green LED (Pin D13) */}
                                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/90">
                                    <span className={`w-5 h-5 rounded-full transition-all duration-300 ${ledGreen ? 'bg-emerald-400 shadow-[0_0_18px_#34d399]' : 'bg-slate-800 opacity-40'}`}></span>
                                    <span className="text-[11px] font-bold text-slate-200">GREEN</span>
                                    <span className="text-[9px] font-mono text-slate-400">Pin D13 • Fresh</span>
                                </div>

                                {/* Yellow LED (Pin D6) */}
                                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/90">
                                    <span className={`w-5 h-5 rounded-full transition-all duration-300 ${ledYellow ? 'bg-amber-400 shadow-[0_0_18px_#fbbf24]' : 'bg-slate-800 opacity-40'}`}></span>
                                    <span className="text-[11px] font-bold text-slate-200">YELLOW</span>
                                    <span className="text-[9px] font-mono text-slate-400">Pin D6 • Warning</span>
                                </div>

                                {/* Red LED (Pin D7) */}
                                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/90">
                                    <span className={`w-5 h-5 rounded-full transition-all duration-300 ${ledRed ? 'bg-rose-500 shadow-[0_0_18px_#f43f5e]' : 'bg-slate-800 opacity-40'}`}></span>
                                    <span className="text-[11px] font-bold text-slate-200">RED</span>
                                    <span className="text-[9px] font-mono text-slate-400">Pin D7 • Spoiled</span>
                                </div>
                            </div>
                        </div>

                        {/* Physical 1602A Parallel LCD Display Twin */}
                        <div className="mt-4 bg-[#051c24] p-4 rounded-2xl border border-cyan-900/70 shadow-inner font-mono">
                            <div className="flex items-center justify-between text-[10px] text-cyan-400/80 pb-2 border-b border-cyan-950">
                                <span>Parallel LCD 1602A</span>
                                <span className="text-cyan-300">D12, D11, D5, D4, D3, D2</span>
                            </div>
                            <div className="mt-2.5 p-3 rounded-lg bg-[#02141a] text-[#00f7ff] shadow-[0_0_14px_rgba(0,247,255,0.2)] font-bold text-sm tracking-widest text-center space-y-1 select-none">
                                <div className="truncate">{lcdLine1}</div>
                                <div className="truncate text-yellow-300">{lcdLine2}</div>
                            </div>
                        </div>

                        {/* Hardware Wiring Quick Summary */}
                        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-500">IR Presence:</span> <span className="text-slate-300 font-bold">D8</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-500">Gas (MQ-135):</span> <span className="text-slate-300 font-bold">A0</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-500">Buzzer:</span> <span className="text-slate-300 font-bold">D9</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-500">Reset Button:</span> <span className="text-slate-300 font-bold">D10</span>
                            </div>
                        </div>
                    </div>

                    {/* State Lock Indicator Footer */}
                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Detection State:</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded-full ${lockedClassification ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                            {lockedClassification ? `LOCKED: ${lockedClassification}` : 'WAITING FOR FOOD'}
                        </span>
                    </div>
                </div>

                {/* Freshness Status & Live Sensor Matrix */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    
                    {/* Top Row: Freshness Status Card + MQ-135 Gas Telemetry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Freshness Status Card */}
                        <div className="bg-white dark:bg-[#131c2e] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-[0_12px_40px_rgba(24,28,30,0.06)] flex flex-col justify-between text-center relative overflow-hidden transition-colors">
                            <div className="w-full flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Locked Classification</span>
                                <span className={`px-3 py-0.5 rounded-full text-xs font-black border ${theme.badgeBg}`}>
                                    {freshnessStatus.toUpperCase()}
                                </span>
                            </div>

                            <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-2">
                                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle className="text-slate-100 dark:text-slate-800" cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                    <circle 
                                        cx="50" cy="50" fill="none" r="40" 
                                        stroke="currentColor"
                                        className={`${theme.textColor} transition-all duration-700 ease-out`}
                                        strokeDasharray="251" 
                                        strokeDashoffset={251 - (251 * (riskScore / 100))}
                                        strokeLinecap="round" strokeWidth="8"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl mb-0.5" style={{ color: freshnessStatus === 'Spoiled' ? '#e11d48' : freshnessStatus === 'Warning' ? '#d97706' : freshnessStatus === 'Fresh' ? '#059669' : '#64748b' }}>
                                        {theme.icon}
                                    </span>
                                    <span className={`text-lg font-black tracking-tight ${theme.textColor}`}>
                                        {freshnessStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                                {recommendation}
                            </div>
                        </div>

                        {/* MQ-135 Gas Telemetry Meter */}
                        <div className="bg-white dark:bg-[#131c2e] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-[0_12px_40px_rgba(24,28,30,0.06)] flex flex-col justify-between space-y-4 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black shadow-sm">
                                        <span className="material-symbols-outlined">gas_meter</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">MQ-135 Gas Sensor</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Live Analog Response (Pin A0)</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black font-headline text-slate-900 dark:text-white">{gasResponse}</span>
                                    <span className="text-xs font-bold text-slate-400 ml-1 uppercase">RAW</span>
                                </div>
                            </div>

                            {/* Gas Meter Bar */}
                            <div className="space-y-1.5">
                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex drop-shadow-inner border border-slate-200 dark:border-slate-700 relative">
                                    <div 
                                        className={`h-full transition-all duration-700 ease-out rounded-full ${gasResponse > 450 ? 'bg-rose-500' : gasResponse > 200 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(100, (gasResponse / 1023) * 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                                    <span>0 Ambient</span>
                                    <span>200 Warning</span>
                                    <span>450 Spoiled</span>
                                    <span>1023 Max</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                Continuous analog gas response broadcasts live while classification decision remains deterministic and locked.
                            </p>
                        </div>

                    </div>

                    {/* Bottom Row: IR Sensor Presence & Calculated Risk Score */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* IR Presence Sensor (Pin D8 Active LOW) */}
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200/80 dark:border-slate-800 shadow-[0_12px_40px_rgba(24,28,30,0.05)] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-2xl">sensors</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">IR Presence Sensor (Pin D8)</p>
                                    <p className={`text-base font-black ${foodPresence === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {foodPresence === 1 ? 'Food Detected (LOW)' : 'No Food (HIGH)'}
                                    </p>
                                </div>
                            </div>
                            <span className={`w-4 h-4 rounded-full ${foodPresence === 1 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-300'}`}></span>
                        </div>

                        {/* Calculated Risk Index */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-3xl shadow-[0_16px_40px_rgba(5,150,105,0.2)] text-white flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest font-mono">Calculated Risk Score</p>
                                <div className="flex items-baseline gap-2 my-0.5">
                                    <span className="text-3xl font-black tracking-tight">{riskScore}%</span>
                                    <span className="text-xs font-semibold opacity-90">Decomposition Index</span>
                                </div>
                                <p className="text-[11px] opacity-90">Locked for current item</p>
                            </div>
                            <span className="material-symbols-outlined text-4xl opacity-80">verified_user</span>
                        </div>

                    </div>

                </div>
            </div>

            {/* Diagnostic & Telemetry Console */}
            <div className="bg-[#0f172a] text-slate-200 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="font-bold text-slate-100 tracking-wider">HARDWARE TELEMETRY & COM ACTIVITY CONSOLE</span>
                    </div>
                    <span className="text-[10px] text-slate-400">9600 BAUD | NON-BLOCKING ASYNC STREAM</span>
                </div>

                <div className="h-36 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
                    {logEntries.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <span className="text-slate-500 shrink-0">[{log.time}]</span>
                            <span className={log.type === 'error' ? 'text-rose-400' : log.type === 'warning' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                                {log.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
