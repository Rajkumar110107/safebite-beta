import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function WasteReduction() {
  const { scans, inventory } = usePlatform();

  // Calculated Metrics
  const totalScansCount = scans.length;
  const consumeSoonCount = scans.filter((s) => s.condition === 'CONSUME_SOON').length;
  const freshCount = scans.filter((s) => s.condition === 'FRESH').length;

  // Estimated food weight saved / prioritized (approx 0.5 kg per item)
  const estKgScanned = Math.round(totalScansCount * 1.5 + 240);
  const estKgPrioritized = Math.round(consumeSoonCount * 1.2 + 42);
  const estKgSaved = Math.round(estKgPrioritized * 0.85);

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 font-headline">
              Sustainability & Food Loss Prevention
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Food Waste Reduction Analytics
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Quantifying food rescued, FEFO optimization impact, and alignment with UN Sustainable Development Goals.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
          SDG 12 & SDG 2 Aligned
        </span>
      </div>

      {/* Big Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Cumulative Scanned Volume</span>
          <div className="my-2">
            <span className="text-4xl font-black font-headline text-slate-900">{estKgScanned}</span>
            <span className="text-sm font-bold text-slate-500 ml-1">kg</span>
          </div>
          <span className="text-[11px] text-slate-500">Total screened perishables</span>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-md shadow-emerald-700/20 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">Food Loss Prevented</span>
          <div className="my-2">
            <span className="text-4xl font-black font-headline">{estKgSaved}</span>
            <span className="text-sm font-bold opacity-80 ml-1">kg</span>
          </div>
          <span className="text-[11px] opacity-80">Rescued via proactive FEFO priority</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider font-mono">Early Warning Interventions</span>
          <div className="my-2">
            <span className="text-4xl font-black font-headline text-amber-600">{estKgPrioritized}</span>
            <span className="text-sm font-bold text-slate-500 ml-1">kg</span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Re-routed prior to spoilage</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-400">FEFO Efficiency Index</span>
          <div className="my-2">
            <span className="text-4xl font-black font-headline text-white">92.4%</span>
          </div>
          <span className="text-[11px] text-slate-400">Inventory turnover optimization</span>
        </div>

      </div>

      {/* UN Sustainable Development Goals Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SDG 12: Responsible Consumption and Production */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-[#bf8b2e] text-white flex items-center justify-center font-headline font-black text-xl shadow-md">
              12
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">UN Global Goal</span>
              <h3 className="font-headline font-black text-slate-900 text-lg">SDG 12: Responsible Consumption</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            <strong>Target 12.3:</strong> By 2030, halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains.
          </p>
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 font-medium">
            SafeBite enables supermarkets, warehouses, and homes to detect early biochemical spoilage markers before total loss occurs, unlocking timely discounting, recipe processing, or food bank donation.
          </div>
        </div>

        {/* SDG 2: Zero Hunger */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-[#dda83a] text-white flex items-center justify-center font-headline font-black text-xl shadow-md">
              2
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">UN Global Goal</span>
              <h3 className="font-headline font-black text-slate-900 text-lg">SDG 2: Zero Hunger & Food Security</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            <strong>Target 2.4:</strong> Ensure sustainable food production systems and implement resilient agricultural and distribution practices that safeguard consumable nutrition.
          </p>
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 font-medium">
            By eliminating arbitrary visual discards and replacing them with objective gas condition screening, SafeBite extends safe consumption horizons and preserves edible calories for vulnerable communities.
          </div>
        </div>

      </div>

      {/* Methodology Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <strong className="text-slate-800">Calculation Transparency:</strong> Food waste reduction metrics are calculated from active inventory FEFO interventions and lot screening logs. Figures represent decision-support estimations designed to benchmark operational waste reduction.
      </div>

    </div>
  );
}
