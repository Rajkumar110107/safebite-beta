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
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">ac_unit</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-800 font-headline">
              Supply Chain & Cold Chain Intelligence
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Cold Chain & Storage Flow
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            End-to-end perishable journey tracking from farm origin to retail point-of-sale intake.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <span>Active Track: Batch #AAVIN-0910</span>
        </div>
      </div>

      {/* Visual Journey Stepper */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <h3 className="font-headline font-black text-slate-900 text-lg">Supply Chain Custody Flow</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {stages.map((stage, idx) => (
            <div key={stage.name} className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20">
                <span className="material-symbols-outlined text-2xl">{stage.icon}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-800 uppercase">Stage 0{idx + 1}</span>
              <h4 className="font-headline font-black text-slate-900 text-xs">{stage.name}</h4>
              <p className="text-[11px] text-slate-500">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cold Chain Checkpoints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-headline font-black text-slate-900 text-base">Checkpoint Audit Log</h3>
          <span className="text-xs font-mono text-slate-500">5 Telemetry Points Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-bold">Supply Chain Stage</th>
                <th className="px-6 py-3 font-bold">Facility / Carrier</th>
                <th className="px-6 py-3 font-bold">Timestamp</th>
                <th className="px-6 py-3 font-bold">Logged Thermal / Gas Condition</th>
                <th className="px-6 py-3 font-bold text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
              {coldChainLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{log.stage}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{log.location}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono font-bold ${log.tempLogged.includes('Future') ? 'text-slate-400 italic' : log.tempLogged.includes('Spike') ? 'text-amber-600' : 'text-slate-800'}`}>
                      {log.tempLogged}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      log.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
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
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="material-symbols-outlined text-cyan-700 text-base">sensors</span>
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
