import React from 'react';

export default function About() {
  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 pb-16 max-w-5xl mx-auto space-y-8 sm:space-y-10 font-body transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 sm:p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl sm:text-2xl">info</span>
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-headline">
              Platform Architecture & Identity
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
            About SafeBite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            An intelligent, non-destructive food-condition screening and inventory intelligence ecosystem.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          SafeBite Platform v2.0
        </span>
      </div>

      {/* Core Mission Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#090d16] dark:via-slate-900 dark:to-[#0f172a] text-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl border border-slate-700 dark:border-slate-800 space-y-4">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Platform Core Principle</span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tight text-white">
          Hardware Senses • ML Interprets • Software Manages
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          SafeBite is NOT an apple-only project. It is an intelligent food-condition screening and management platform engineered for diverse perishable food categories—including dairy, fruits, poultry, meats, bakery, and packaged beverages.
        </p>
      </div>

      {/* Three Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">sensors</span>
          </div>
          <h3 className="font-headline font-black text-slate-900 dark:text-white text-base">1. 🔬 DETECT</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Physical hardware performs non-destructive gas condition screening (MQ-135) and presence detection (IR). The physical device delivers immediate, locked screening results.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">psychology</span>
          </div>
          <h3 className="font-headline font-black text-slate-900 dark:text-white text-base">2. 🧠 UNDERSTAND</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Machine learning algorithms evaluate volatile gas patterns, food categories, and storage durations to classify conditions (Fresh / Consume Soon / Alert) with explainable confidence.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">tune</span>
          </div>
          <h3 className="font-headline font-black text-slate-900 dark:text-white text-base">3. 📊 MANAGE</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The web application orchestrates product metadata, nutrition calculations, allergen alerts, FEFO inventory queues, batch tracking, cold chain flows, and waste metrics.
          </p>
        </div>

      </div>

      {/* Physical Hardware Form Factors */}
      <div className="bg-white dark:bg-[#131c2e] p-5 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <h3 className="font-headline font-black text-slate-900 dark:text-white text-base sm:text-lg">Physical Product Form Factors</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 transition-colors">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase font-mono">
              <span className="material-symbols-outlined text-base">factory</span>
              <span>Industrial Form Factor</span>
            </div>
            <h4 className="font-headline font-black text-slate-900 dark:text-white text-sm sm:text-base">Handheld Gun-Shaped Scanner</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed for supermarkets, distribution warehouses, food-processing units, and storage facilities. Enables rapid point-and-scan inspection of large pallet volumes with immediate LED/LCD confirmation.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 transition-colors">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase font-mono">
              <span className="material-symbols-outlined text-base">home</span>
              <span>Individual / Consumer Form Factor</span>
            </div>
            <h4 className="font-headline font-black text-slate-900 dark:text-white text-sm sm:text-base">Benchtop Box-Shaped Scanner</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed for households, commercial kitchens, and restaurants. Place a food sample on the sensor stage to initiate automated screening, pantry tracking, and recipe suggestions.
            </p>
          </div>

        </div>
      </div>

      {/* Verified Hardware Pinout Reference (Locked Specifications) */}
      <div className="bg-[#0f172a] dark:bg-[#090d16] text-slate-200 p-5 sm:p-8 rounded-3xl border border-slate-800 space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Verified Hardware Wiring (LOCKED SPECIFICATIONS)</span>
          <span className="text-[10px] text-slate-500">Arduino Uno R3 • 9600 Baud</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MQ-135 Gas:</span>
            <span className="text-white font-bold">Pin A0 (Analog)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">IR Presence:</span>
            <span className="text-white font-bold">Pin D8 (Active LOW)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Buzzer:</span>
            <span className="text-white font-bold">Pin D9</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Reset Button:</span>
            <span className="text-white font-bold">Pin D10 (INPUT_PULLUP)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-emerald-400 block text-[10px]">Green LED (Fresh):</span>
            <span className="text-white font-bold">Pin D13</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-amber-400 block text-[10px]">Yellow LED (Warning):</span>
            <span className="text-white font-bold">Pin D6</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-rose-400 block text-[10px]">Red LED (Spoiled):</span>
            <span className="text-white font-bold">Pin D7</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-cyan-400 block text-[10px]">LCD 1602A Parallel:</span>
            <span className="text-white font-bold">D12, D11, D5, D4, D3, D2</span>
          </div>
        </div>
      </div>

      {/* Regulatory & Safety Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1 transition-colors">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">verified_user</span>
          <span>Compliance & Operational Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          SafeBite is an assistive screening and decision-support tool. It measures non-destructive biochemical gas emissions to aid humans in detecting early food spoilage. It is not a certified laboratory instrument and does not guarantee microbiological sterility. Always combine SafeBite condition screening with visual and olfactory inspection.
        </p>
      </div>

    </div>
  );
}
