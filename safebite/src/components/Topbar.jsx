import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function Topbar({ onNavigate, onToggleMobileNav, isMobileNavOpen }) {
  const { mode, switchMode, theme, toggleTheme, alerts } = usePlatform();
  const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 z-40 flex justify-between items-center px-3 sm:px-6 md:px-10 transition-colors duration-200">
      
      {/* Left: Mobile Drawer Button & Mode Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle Menu"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileNavOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Mode Switcher Toggle */}
        <div className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700/80">
          <button
            onClick={() => switchMode('INDIVIDUAL')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'INDIVIDUAL'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Individual / Household Mode"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span className="hidden sm:inline">Individual</span>
          </button>

          <button
            onClick={() => switchMode('INDUSTRIAL')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'INDUSTRIAL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Industrial / Warehouse Mode"
          >
            <span className="material-symbols-outlined text-base">factory</span>
            <span className="hidden sm:inline">Industrial</span>
          </button>
        </div>

        <span className="hidden xl:inline text-[11px] font-mono text-slate-400 dark:text-slate-400">
          {mode === 'INDUSTRIAL' ? '• Supermarket / Warehouse Mode' : '• Consumer & Household Mode'}
        </span>
      </div>

      {/* Right: Theme Toggle (Sun/Moon), Alerts Pill, and User Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-center"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? (
            <span className="material-symbols-outlined text-xl text-amber-400 animate-pulse">light_mode</span>
          ) : (
            <span className="material-symbols-outlined text-xl text-slate-600 hover:text-slate-900">dark_mode</span>
          )}
        </button>

        {/* Alerts Pill */}
        <button
          onClick={() => onNavigate && onNavigate('Alerts')}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Active Alerts"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {unresolvedAlerts > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {unresolvedAlerts}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center justify-center font-headline shrink-0">
            {mode === 'INDUSTRIAL' ? 'AR' : 'SB'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-headline leading-tight">
              {mode === 'INDUSTRIAL' ? 'Alex Rivera' : 'SafeBite User'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
              {mode === 'INDUSTRIAL' ? 'Quality Operations Lead' : 'Household Account'}
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}
