import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function StorageColdChain() {
  const { coldChainLogs } = usePlatform();

  const stages = [
    { name: "Farm / Harvest", icon: "agriculture", desc: "Origin collection & pre-cooling" },
    { name: "Processing Plant", icon: "precision_manufacturing", desc: "Pasteurization & packaging" },
    { name: "Central Cold Storage", icon: "warehouse", desc: "Warehouse cold room storage" },
    { name: "Refrigerated Transit", icon: "local_shipping", desc: "Inter-city reefer logistics" },
    { name: "Retail Intake (SafeBite)", icon: "storefront", desc: "Supermarket intake screening" }
  ];

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-body transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 sm:p-2 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl sm:text-2xl">ac_unit</span>
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-cyan-800 dark:text-cyan-400 font-headline">
              Supply Chain & Cold Chain Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
            Cold Chain & Storage Flow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            End-to-end perishable journey tracking from farm origin to retail point-of-sale intake.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <span>Active Track: Batch #AAVIN-0910</span>
        </div>
      </div>

      {/* Visual Journey Stepper */}
      <div className="bg-white dark:bg-[#131c2e] p-5 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <h3 className="font-headline font-black text-slate-900 dark:text-white text-base sm:text-lg">Supply Chain Custody Flow</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {stages.map((stage, idx) => (
            <div key={stage.name} className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 relative space-y-2 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20">
                <span className="material-symbols-outlined text-2xl">{stage.icon}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-800 dark:text-cyan-400 uppercase">Stage 0{idx + 1}</span>
              <h4 className="font-headline font-black text-slate-900 dark:text-white text-xs">{stage.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cold Chain Checkpoints Table */}
      <div className="bg-white dark:bg-[#131c2e] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="font-headline font-black text-slate-900 dark:text-white text-sm sm:text-base">Checkpoint Audit Log</h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">5 Telemetry Points Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 sm:px-6 py-3 font-bold">Supply Chain Stage</th>
                <th className="px-5 sm:px-6 py-3 font-bold">Facility / Carrier</th>
                <th className="px-5 sm:px-6 py-3 font-bold">Timestamp</th>
                <th className="px-5 sm:px-6 py-3 font-bold">Logged Thermal / Gas Condition</th>
                <th className="px-5 sm:px-6 py-3 font-bold text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131c2e]">
              {coldChainLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 sm:px-6 py-4 font-bold text-slate-900 dark:text-white">{log.stage}</td>
                  <td className="px-5 sm:px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{log.location}</td>
                  <td className="px-5 sm:px-6 py-4 font-mono text-slate-500 dark:text-slate-400">{log.timestamp}</td>
                  <td className="px-5 sm:px-6 py-4">
                    <span className={`font-mono font-bold ${log.tempLogged.includes('Future') ? 'text-slate-400 italic' : log.tempLogged.includes('Spike') ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {log.tempLogged}
                    </span>
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      log.status === 'PASS'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}>
                      {log.compliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Disclosures */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 transition-colors">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <span className="material-symbols-outlined text-cyan-700 dark:text-cyan-400 text-base">sensors</span>
          <span>Sensor Architecture Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          The current SafeBite hardware prototype features an <strong>MQ-135 volatile gas sensor and an active infrared presence trigger</strong>. 
          Thermal temperature and ambient relative humidity telemetry in supply chain flows are labeled as <strong>[Future Sensor Integration]</strong> and demonstrate how cold chain tracking will harmonize with hardware condition screening upon future sensor expansion.
        </p>
      </div>

    </div>
  );
}
