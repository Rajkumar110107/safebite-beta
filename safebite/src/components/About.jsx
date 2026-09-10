import React from 'react';
import { Info } from 'lucide-react';

export default function About() {
    return (
        <div className="pt-24 px-10 pb-12 max-w-5xl mx-auto space-y-10 font-body">
            <section className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className="space-y-2">
                    <span className="text-primary font-headline font-extrabold text-sm tracking-widest uppercase">System Information</span>
                    <h2 className="text-5xl font-black font-headline tracking-tighter text-on-surface">About SafeBite AI</h2>
                    <p className="text-on-surface-variant max-w-lg font-body">Architecture and operational details of the Living Laboratory.</p>
                </div>
            </section>
            
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_12px_40px_rgba(24,28,30,0.06)] border border-slate-100/50">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-outline-variant/10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                    </div>
                    <p className="text-lg text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface font-headline font-bold">SafeBite AI</strong> is a modern food freshness assessment system. 
                        It evaluates the safety of your food by analyzing sensor readings, 
                        specifically Ammonia (NH3), Hydrogen Sulfide (H2S), and internal environmental factors.
                    </p>
                </div>
                
                <div className="space-y-10">
                    <div>
                        <h3 className="text-2xl font-black font-headline tracking-tight text-on-surface mb-6">How it Works</h3>
                        <ul className="space-y-4">
                            <li className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 w-max bg-primary-fixed text-on-primary-container">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Fresh
                                </span>
                                <span className="text-on-surface-variant text-sm">Target variables are optimally balanced. Food is perfectly safe to consume and optimal for storage.</span>
                            </li>
                            <li className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-surface-container-low rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 w-max bg-tertiary-fixed text-on-tertiary-container">
                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                    Warning
                                </span>
                                <span className="text-on-surface-variant text-sm">Environmental metrics indicate the food is beginning to approach limits. Consume quickly.</span>
                            </li>
                            <li className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-error-container/20 border-error/5 rounded-2xl border transition-all">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 w-max bg-error text-on-error">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    Spoiled
                                </span>
                                <span className="text-on-surface-variant text-sm">Sensors reflect high spoilage risk. Discard immediately to prevent illness.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-8 border-t border-outline-variant/10">
                        <h3 className="text-2xl font-black font-headline tracking-tight text-on-surface mb-4">Smart Recommendations</h3>
                        <p className="text-on-surface-variant leading-relaxed">
                            SafeBite AI provides food-specific recommendations based on its Random Forest model. By analyzing thousands of data points encompassing temperature, humidity, storage days, methane, and CO2, our system guides you on how to handle perishables with absolute conviction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
