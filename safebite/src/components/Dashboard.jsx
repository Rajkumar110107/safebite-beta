import React from 'react';
import ConnectionBadge from './ConnectionBadge';
import StatusCircle from './StatusCircle';
import SensorCard from './SensorCard';
import GasBar from './GasBar';

export default function Dashboard({ data }) {
    if (data?.deviceStatus === "disconnected" || data?.error === "Device not connected") {
        return (
            <div className="empty-state">
                <div className="empty-icon text-error animate-pulse">⚠️</div>
                <h2 className="text-error">Device not connected</h2>
                <p>Please check the USB connection on COM4 and restart the backend.</p>
            </div>
        );
    }

    if (!data || !data.prediction || !data.sensorData) {
        return (
            <div className="empty-state">
                <div className="empty-icon animate-pulse text-primary">📡</div>
                <h2>Waiting for sensor data...</h2>
                <p>Reading data from hardware (COM4)...</p>
            </div>
        );
    }

    const { deviceStatus, prediction, sensorData } = data;

    // Presence Badge Logic Fix
    const presence = sensorData?.presence;
    console.log("Frontend Presence:", presence);
    
    let hasFood = false;
    if (presence === 1) {
        hasFood = true;
    } else if (presence === 0) {
        hasFood = false;
    }

    return (
        <div className="pt-24 px-10 pb-12 max-w-7xl mx-auto">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="max-w-2xl">
                    <ConnectionBadge status={deviceStatus} />
                    
                    <h2 className="text-5xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-4 drop-shadow-sm">
                        Deep Learning <span className="text-primary italic font-serif">Safety Prediction</span>
                    </h2>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-medium">
                        Real-time food freshness analysis using sensor intelligence.
                    </p>
                </div>
            </div>

            {/* Main AI Matrix & Cards */}
            <div className="grid grid-cols-12 gap-8">
                
                {/* AI Circular Display */}
                <div className="col-span-12 lg:col-span-4">
                    <StatusCircle status={prediction.status} recommendation={prediction.recommendation} />
                </div>

                {/* Hardware Grid & Risk Cards */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Real-time Hardware Integration Map */}
                    <div className="bg-surface-container-low p-8 rounded-3xl border border-white/60 shadow-[0_12px_40px_rgba(24,28,30,0.06)] backdrop-blur-md relative overflow-hidden flex-1">
                        
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-2xl font-extrabold tracking-tight mb-1 text-on-surface">Hardware Sensor Matrix</h3>
                                <p className="text-on-surface-variant text-sm font-medium">Monitoring active COM4 telemetry and state feeds.</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <SensorCard 
                                title="Gas Value (MQ)" 
                                icon="MQ" 
                                valueText={sensorData.gas_value || 0} 
                                valueSubtext="RAW"
                            >
                                <GasBar value={sensorData.gas_value || 0} />
                            </SensorCard>
                            
                            <SensorCard 
                                title="IR Presence" 
                                icon="IR" 
                                valueText={hasFood ? 'Food Detected' : 'No Food Detected'} 
                                valueColorClass={hasFood ? 'text-primary' : 'text-error'}
                            >
                                <div className="h-4 bg-surface-container-highest rounded-full overflow-hidden flex drop-shadow-inner opacity-50 relative">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${hasFood ? 'bg-primary w-full' : 'bg-error w-full shadow-[inset_0_0_12px_rgba(0,0,0,0.2)]'}`}
                                    ></div>
                                </div>
                            </SensorCard>
                        </div>
                    </div>

                    {/* Meta Storage & Risk Blocks */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-primary p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,108,75,0.15)] text-on-primary flex flex-col relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2 font-mono">Algorithm Risk Score</p>
                            <h3 className="text-6xl font-black tracking-tighter drop-shadow-sm">
                                {prediction.riskScore !== undefined ? Math.round(prediction.riskScore * 100) : 0}%
                            </h3>
                            <p className="text-sm leading-relaxed opacity-90 mt-4">Calculated from dynamic multi-sensor array mapping.</p>
                            <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                                <span className="material-symbols-outlined text-[150px]">radar</span>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-[#1e293b] text-white flex flex-col relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                            <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-2 text-primary-container font-mono">Storage Record</p>
                            <div className="flex items-end gap-3 mt-auto">
                                <h3 className="text-6xl font-black tracking-tighter text-white drop-shadow-md">{sensorData.storageDays || 0}</h3>
                                <span className="text-xl font-bold opacity-70 pb-2">DAYS</span>
                            </div>
                            <div className="absolute -bottom-6 -right-6 opacity-20">
                                <span className="material-symbols-outlined text-[120px]">calendar_month</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
