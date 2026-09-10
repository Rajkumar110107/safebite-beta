import React, { useState, useEffect } from 'react';

export default function Sensors({ onCalculate, isPredicting }) {
    const [foodType, setFoodType] = useState('Chicken');
    const [gasValue, setGasValue] = useState(0);
    const [presence, setPresence] = useState(0);
    const [storageDays, setStorageDays] = useState(0);

    // Fetch Live Data
    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const res = await fetch("http://localhost:3000/latest");
                if (!res.ok) return;
                const data = await res.json();
                
                if (data && data.sensorData) {
                    setGasValue(data.sensorData.gas_value || 0);
                    setPresence(data.sensorData.presence || 0);
                    setStorageDays(data.sensorData.storageDays || 0);
                }
            } catch (err) {
                // Ignore silent polls
            }
        };

        const interval = setInterval(fetchSensorData, 2000);
        return () => clearInterval(interval);
    }, []);

    // Auto Prediction Loop
    useEffect(() => {
        if (presence === 1 && !isPredicting) {
            handleCalculate();
        }
    }, [presence]);

    const handleCalculate = (e) => {
        if (e) e.preventDefault();
        console.log("Sensor Data:", gasValue, presence, storageDays);
        // Fire central prediction hook using the synced automated values
        onCalculate(foodType, gasValue, presence, storageDays);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">Sensor Input Matrix</h2>
                    <p className="text-on-surface-variant max-w-md mt-2 leading-relaxed">
                        Features explicitly bound to active physical COM4 streams for realtime transformation.
                    </p>
                </div>
            </div>

            <div className="col-span-12">
                <div className="bg-surface-container-lowest p-8 rounded-[32px] shadow-[0_12px_40px_rgba(24,28,30,0.06)] border border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-1/3">
                            <h3 className="text-3xl font-extrabold tracking-tight mb-6">Live Input Vectors</h3>
                            <p className="text-on-surface-variant mb-8 leading-relaxed">Raw telemetry inherently synchronized from the serial backend avoiding missing zero-state crashes.</p>
                            
                            <form onSubmit={handleCalculate} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Food Category</label>
                                    <select 
                                        value={foodType} 
                                        onChange={(e) => setFoodType(e.target.value)}
                                        className="bg-surface-container-highest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none"
                                    >
                                        <option value="Chicken">Chicken</option>
                                        <option value="Fish">Fish</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Milk">Milk</option>
                                    </select>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isPredicting || presence === 0}
                                    className="mt-4 bg-gradient-to-r from-primary to-primary-container text-white py-3 px-4 rounded-full font-bold shadow-lg shadow-primary/20 flex justify-center items-center gap-2 hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 outline-none"
                                >
                                    {isPredicting ? (
                                        <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">bolt</span>
                                    )}
                                    {isPredicting ? 'Predicting...' : presence === 0 ? 'Awaiting Food Sample...' : 'Run AI Prediction'}
                                </button>
                            </form>
                        </div>
                        
                        <div className="lg:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
                                <span className="material-symbols-outlined text-primary mb-4 w-fit">gas_meter</span>
                                <div>
                                    <label className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest mb-1 block">Gas Value (MQ)</label>
                                    <input 
                                        type="number" value={gasValue} readOnly
                                        className="bg-transparent border-b-2 border-slate-200 w-full text-2xl font-black outline-none p-0 cursor-not-allowed opacity-80"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
                                <span className="material-symbols-outlined text-primary mb-4 w-fit">sensors</span>
                                <div>
                                    <label className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest mb-1 block">IR Presence</label>
                                    <input 
                                        type="text" value={presence === 1 ? "Detected" : "Not Detected"} readOnly
                                        className={`bg-transparent border-b-2 w-full text-xl font-black outline-none p-0 cursor-not-allowed ${presence === 1 ? 'border-primary text-primary' : 'border-error text-error opacity-80'}`}
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
                                <span className="material-symbols-outlined text-primary mb-4 w-fit">calendar_month</span>
                                <div>
                                    <label className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest mb-1 block">Storage Days</label>
                                    <input 
                                        type="number" value={storageDays} readOnly
                                        className="bg-transparent border-b-2 border-slate-200 w-full text-2xl font-black outline-none p-0 cursor-not-allowed opacity-80"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
