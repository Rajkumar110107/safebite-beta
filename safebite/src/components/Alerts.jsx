import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function Alerts({ onNavigate }) {
  const { alerts, resolveAlert } = usePlatform();

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 pb-16 max-w-6xl mx-auto space-y-6 sm:space-y-8 font-body transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 sm:p-2 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl sm:text-2xl">notifications_active</span>
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-rose-800 dark:text-rose-400 font-headline">
              Incident & Priority Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
            Active Spoilage & Quality Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Real-time notifications triggered by physical sensor threshold exceedances and inventory FEFO priorities.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {unresolvedAlerts.length} Active Incident(s)
          </span>
        </div>
      </div>

      {/* Active Unresolved Alerts List */}
      <div className="space-y-4">
        {unresolvedAlerts.length === 0 ? (
          <div className="bg-white dark:bg-[#131c2e] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3 transition-colors">
            <div className="w-12 sm:w-14 h-12 sm:h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">verified</span>
            </div>
            <h3 className="font-headline font-black text-slate-900 dark:text-white text-base sm:text-lg">System Clear • No Active Alerts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              All inventory lots and recent screenings are operating within verified fresh and acceptable parameters.
            </p>
          </div>
        ) : (
          unresolvedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 sm:p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 transition-all ${
                alert.severity === 'HIGH'
                  ? 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/80 text-rose-950 dark:text-rose-100'
                  : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/80 text-amber-950 dark:text-amber-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  alert.severity === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    {alert.severity === 'HIGH' ? 'dangerous' : 'priority_high'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider ${
                      alert.severity === 'HIGH'
                        ? 'bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200'
                        : 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200'
                    }`}>
                      {alert.severity} URGENCY
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{alert.timestamp} • {alert.category}</span>
                  </div>
                  <h4 className="font-headline font-black text-sm sm:text-base text-slate-900 dark:text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{alert.message}</p>
                  {alert.action && (
                    <div className="pt-1 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-700 dark:text-emerald-400">task_alt</span>
                      <span>Recommended Action: {alert.action}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved Archive */}
      {resolvedAlerts.length > 0 && (
        <div className="bg-white dark:bg-[#131c2e] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
          <h3 className="font-headline font-black text-slate-900 dark:text-white text-sm">Resolved Alerts Archive ({resolvedAlerts.length})</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {resolvedAlerts.map((a) => (
              <div key={a.id} className="py-2.5 flex justify-between items-center opacity-60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base">check_circle</span>
                  <span className="text-slate-800 dark:text-slate-200">{a.title}</span>
                </div>
                <span className="font-mono text-[10px]">{a.timestamp} (Resolved)</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
