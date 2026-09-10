import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { mode, alerts } = usePlatform();
  const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;

  const navGroups = [
    {
      group: "Screening Core",
      items: [
        { name: 'Dashboard', icon: 'dashboard' },
        { name: 'Scan Food', icon: 'qr_code_scanner' },
        { name: 'Hardware', icon: 'developer_board', badge: 'LOCKED' }
      ]
    },
    {
      group: "Food Intelligence",
      items: [
        { name: 'Food Details', icon: 'receipt_long' },
        { name: 'Nutrition', icon: 'nutrition' },
        { name: 'Food Condition', icon: 'health_and_safety' },
        { name: 'AI Assistant', icon: 'psychology' }
      ]
    },
    {
      group: "Management & Supply",
      items: [
        { name: 'Inventory', icon: 'inventory_2' },
        ...(mode === 'INDUSTRIAL'
          ? [
              { name: 'Batch Management', icon: 'factory' },
              { name: 'Cold Chain', icon: 'ac_unit' }
            ]
          : []),
        { name: 'Waste Reduction', icon: 'eco' }
      ]
    },
    {
      group: "Records & Insights",
      items: [
        { name: 'History', icon: 'history' },
        { name: 'Alerts', icon: 'notifications_active', badge: unresolvedAlerts > 0 ? `${unresolvedAlerts}` : null, badgeColor: 'bg-rose-500 text-white' },
        { name: 'About', icon: 'info' }
      ]
    }
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-900 text-slate-300 flex flex-col py-6 px-3 z-50 border-r border-slate-800 select-none">
      
      {/* Brand Header */}
      <div className="px-3 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/30">
            <span className="material-symbols-outlined text-2xl font-bold">shield_with_heart</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight font-headline">SafeBite</h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold font-mono">
              {mode === 'INDUSTRIAL' ? 'Industrial Platform' : 'Consumer Platform'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto space-y-6 py-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((grp) => (
          <div key={grp.group} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
              {grp.group}
            </p>
            {grp.items.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {item.icon}
                    </span>
                    <span className="font-headline tracking-tight">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      item.badgeColor || (item.badge === 'LOCKED' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'bg-slate-800 text-slate-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Quick Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 px-2 space-y-2">
        <button
          onClick={() => setActiveTab('Scan Food')}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-headline font-black text-xs shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-base">qr_code_scanner</span>
          Quick Scan
        </button>
      </div>

    </aside>
  );
}
