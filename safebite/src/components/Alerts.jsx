import React from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function Alerts({ onNavigate }) {
  const { alerts, resolveAlert } = usePlatform();

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-6xl mx-auto space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">notifications_active</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-rose-800 font-headline">
              Incident & Priority Center
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Active Spoilage & Quality Alerts
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Real-time notifications triggered by physical sensor threshold exceedances and inventory FEFO priorities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            {unresolvedAlerts.length} Active Incident(s)
          </span>
        </div>
      </div>

      {/* Active Unresolved Alerts List */}
      <div className="space-y-4">
        {unresolvedAlerts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="font-headline font-black text-slate-900 text-lg">System Clear • No Active Alerts</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All inventory lots and recent screenings are operating within verified fresh and acceptable parameters.
            </p>
          </div>
        ) : (
          unresolvedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                alert.severity === 'HIGH'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  alert.severity === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  <span className="material-symbols-outlined text-2xl">
                    {alert.severity === 'HIGH' ? 'dangerous' : 'priority_high'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider ${
                      alert.severity === 'HIGH' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {alert.severity} URGENCY
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{alert.timestamp} • {alert.category}</span>
                  </div>
                  <h4 className="font-headline font-black text-base text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{alert.message}</p>
                  {alert.action && (
                    <div className="pt-1 text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-700">task_alt</span>
                      <span>Recommended Action: {alert.action}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer shadow-sm"
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
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-headline font-black text-slate-900 text-sm">Resolved Alerts Archive ({resolvedAlerts.length})</h3>
          <div className="divide-y divide-slate-100 text-xs text-slate-500">
            {resolvedAlerts.map((a) => (
              <div key={a.id} className="py-2.5 flex justify-between items-center opacity-60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  <span>{a.title}</span>
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
