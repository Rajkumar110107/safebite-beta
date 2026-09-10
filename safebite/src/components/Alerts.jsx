import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function Alerts({ history }) {
    const alerts = history.filter(item => item.status === 'Spoiled' || item.status === 'Consume Soon');

    return (
        <div className="pt-24 px-10 pb-12 max-w-7xl mx-auto space-y-10">
            <section className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <span className="text-primary font-headline font-extrabold text-sm tracking-widest uppercase">Safety Monitoring</span>
                    <h2 className="text-5xl font-black font-headline tracking-tighter text-on-surface">Active Alerts</h2>
                    <p className="text-on-surface-variant max-w-lg font-body">Real-time pathogen detection and temperature monitoring for your current inventory.</p>
                </div>
            </section>

            {alerts.length === 0 ? (
                <div className="bg-surface-container-low rounded-[2rem] p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-black font-headline text-on-surface mb-2">System Clear</h3>
                    <p className="text-on-surface-variant">No active alerts. All scanned foods are fresh.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {alerts.map((item, index) => {
                        const isHighPriority = item.status === 'Spoiled';
                        
                        if (isHighPriority && index === 0) {
                            return (
                                <div key={item.id} className="lg:col-span-12 xl:col-span-8 bg-error-container/20 rounded-[2rem] p-8 border border-error/5 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8">
                                        <span className="bg-error text-on-error px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">High Urgency</span>
                                    </div>
                                    <div className="space-y-4 relative z-10 w-full mb-10">
                                        <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-6">
                                            <span className="material-symbols-outlined scale-150" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                        </div>
                                        <h3 className="text-4xl font-black font-headline tracking-tighter text-on-error-container">Critical Spoilage: {item.foodType}</h3>
                                        <p className="text-xl text-on-error-container/80 font-body max-w-xl">
                                            {item.recommendation}
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-end justify-between relative z-10 gap-6 mt-10">
                                        <div className="flex gap-10">
                                            <div>
                                                <span className="block text-[10px] font-bold text-on-error-container/60 uppercase tracking-widest mb-1">TIME DETECTED</span>
                                                <span className="text-lg font-bold text-on-error-container font-headline">{item.date}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-bold text-on-error-container/60 uppercase tracking-widest mb-1">PROBABILITY</span>
                                                <span className="text-lg font-bold text-on-error-container font-headline">{item.riskScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                        <span className="material-symbols-outlined text-[20rem]">biotech</span>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={item.id} className="lg:col-span-12 group bg-surface-container-lowest rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 transition-all hover:bg-surface-container hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${isHighPriority ? 'bg-error/10 text-error' : 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant'}`}>
                                    <span className="material-symbols-outlined">{isHighPriority ? 'warning' : 'inventory_2'}</span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase ${isHighPriority ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'}`}>
                                            {isHighPriority ? 'High' : 'Medium'}
                                        </span>
                                        <span className="text-xs font-medium text-on-surface-variant">{item.date}</span>
                                    </div>
                                    <h5 className="text-xl font-bold font-headline tracking-tight text-on-surface">Warning: {item.foodType} is {item.status.toLowerCase()}</h5>
                                    <p className="text-sm text-on-surface-variant line-clamp-1">{item.recommendation}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Probability</span>
                                    <div className="text-xl font-bold font-headline text-on-surface">{item.riskScore}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
