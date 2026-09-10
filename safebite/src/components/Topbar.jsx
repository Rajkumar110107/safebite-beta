import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function Topbar({ onNavigate }) {
  const { mode, switchMode, alerts } = usePlatform();
  const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 z-40 flex justify-between items-center px-6 md:px-10">
      
      {/* Mode Switcher Toggle */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
          <button
            onClick={() => switchMode('INDIVIDUAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'INDIVIDUAL'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>Individual</span>
          </button>

          <button
            onClick={() => switchMode('INDUSTRIAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'INDUSTRIAL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">factory</span>
            <span>Industrial</span>
          </button>
        </div>

        <span className="hidden lg:inline text-[11px] font-mono text-slate-400">
          {mode === 'INDUSTRIAL' ? '• Supermarket / Warehouse Mode' : '• Consumer & Restaurant Mode'}
        </span>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-4">
        
        {/* Alerts Pill */}
        <button
          onClick={() => onNavigate && onNavigate('Alerts')}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          title="Active Alerts"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {unresolvedAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unresolvedAlerts}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

        {/* User Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center font-headline">
            {mode === 'INDUSTRIAL' ? 'AR' : 'SB'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 font-headline">
              {mode === 'INDUSTRIAL' ? 'Alex Rivera' : 'SafeBite User'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {mode === 'INDUSTRIAL' ? 'Quality Operations Lead' : 'Household Account'}
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}
