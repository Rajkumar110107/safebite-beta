import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function Dashboard({ onNavigate }) {
  const { mode, scans, inventory, alerts, liveTelemetry } = usePlatform();

  const totalScans = scans.length;
  const freshScans = scans.filter((s) => s.condition === 'FRESH').length;
  const warningScans = scans.filter((s) => s.condition === 'CONSUME_SOON').length;
  const spoiledScans = scans.filter((s) => s.condition === 'SPOILED').length;
  const activeAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-body transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 sm:p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl sm:text-2xl">shield_with_heart</span>
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-headline">
              {mode === 'INDUSTRIAL' ? 'Industrial Quality Operations' : 'Intelligent Household Safety'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
            SafeBite Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            {mode === 'INDUSTRIAL'
              ? 'Multi-lot screening analytics, warehouse FEFO tracking, and cold-chain compliance monitoring.'
              : 'Real-time food condition monitoring, nutritional tracking, and pantry shelf-life intelligence.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('Scan Food')}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-headline font-black text-xs rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">qr_code_scanner</span>
            New Food Scan
          </button>
        </div>
      </div>

      {/* KPI Top Cards - Responsive grid 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scans */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Inspections</span>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-400">history</span>
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-headline text-slate-900 dark:text-white">{totalScans}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">scans logged</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Across {inventory.length} active inventory lots</span>
        </div>

        {/* Fresh Condition % */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">Fresh Quality Rate</span>
            <span className="material-symbols-outlined text-emerald-500 dark:text-emerald-400">check_circle</span>
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-headline text-emerald-600 dark:text-emerald-400">
              {totalScans > 0 ? Math.round((freshScans / totalScans) * 100) : 100}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">passed screening</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">{freshScans} optimal lots</span>
        </div>

        {/* Consume Soon */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">Consume Soon (FEFO)</span>
            <span className="material-symbols-outlined text-amber-500 dark:text-amber-400">priority_high</span>
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-headline text-amber-600 dark:text-amber-400">{warningScans}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">approaching limit</span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Prioritize immediate use</span>
        </div>

        {/* Active Spoilage Alerts */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono">Active Spoilage / Alerts</span>
            <span className="material-symbols-outlined text-rose-500 dark:text-rose-400">warning</span>
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black font-headline text-rose-600 dark:text-rose-400">{activeAlerts.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">unresolved</span>
          </div>
          <span className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">{spoiledScans} spoiled units quarantined</span>
        </div>

      </div>

      {/* Main Split Matrix: Recent Inspections (Left) + Hardware Diagnostic & Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Recent Inspections Log Table */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131c2e] p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-headline font-black text-slate-900 dark:text-white text-base sm:text-lg">Recent Condition Screenings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live screening records from SafeBite hardware and barcode scan sessions.</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('History')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer self-start sm:self-auto"
            >
              View All History →
            </button>
          </div>

          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Product</th>
                  <th className="px-4 py-2.5 font-bold">Category</th>
                  <th className="px-4 py-2.5 font-bold">Timestamp</th>
                  <th className="px-4 py-2.5 font-bold">Screening Condition</th>
                  <th className="px-4 py-2.5 font-bold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {scans.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{scan.productName}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400">{scan.category}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400">{scan.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        scan.condition === 'SPOILED'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : scan.condition === 'CONSUME_SOON'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {scan.statusText}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-headline font-bold text-slate-900 dark:text-white">
                      {scan.foodConditionScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Hardware Diagnostic & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Hardware Diagnostic Status Box */}
          <div className="bg-[#0f172a] dark:bg-[#090d16] text-slate-200 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-xl">memory</span>
                <span className="font-headline font-black text-xs text-white uppercase tracking-wider">Hardware Section Status</span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                LOCKED BASELINE
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              The existing SafeBite Hardware Controller operates independently via 9600 Baud Web Serial and mirrors physical Arduino LEDs (D13, D6, D7) and Parallel LCD (1602A).
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/90 dark:bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MQ-135 Gas:</span>
                <span className="text-white font-bold">{liveTelemetry.gas_value || 140} RAW</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 dark:bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">IR Trigger:</span>
                <span className="text-emerald-400 font-bold">Pin D8 (Active LOW)</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('Hardware')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">developer_board</span>
              Open Hardware Controller Twin →
            </button>
          </div>

          {/* Quick Platform Actions */}
          <div className="bg-white dark:bg-[#131c2e] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
            <h4 className="font-headline font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">Quick Jump</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate && onNavigate('Inventory')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 text-left cursor-pointer transition-colors"
              >
                📦 FEFO Inventory
              </button>
              <button
                onClick={() => onNavigate && onNavigate('Nutrition')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 text-left cursor-pointer transition-colors"
              >
                🥗 Nutrition Calc
              </button>
              <button
                onClick={() => onNavigate && onNavigate('AI Assistant')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 text-left cursor-pointer transition-colors"
              >
                🧠 AI Assistant
              </button>
              <button
                onClick={() => onNavigate && onNavigate('Waste Reduction')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 text-left cursor-pointer transition-colors"
              >
                🌱 Waste Analytics
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
