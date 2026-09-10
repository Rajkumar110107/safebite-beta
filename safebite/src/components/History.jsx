import React from 'react';
import { History as HistoryIcon } from 'lucide-react';

export default function History({ history }) {
    return (
        <div className="pt-24 px-10 pb-12 max-w-7xl mx-auto space-y-10">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface">Scan History</h2>
                    <p className="text-on-surface-variant mt-2 font-medium">Review and compare safety data from previous scans.</p>
                </div>
            </section>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 bg-surface-container-low rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(24,28,30,0.06)] border border-slate-100/50">
                    <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/50">
                        <h3 className="text-xl font-bold font-headline text-on-surface">Detailed History Log</h3>
                        <div className="flex gap-2">
                            <span className="bg-surface-container-lowest px-3 py-1 rounded-md text-xs font-bold text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">download</span> Export
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f1f4f6]/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Food Item</th>
                                    <th className="px-8 py-4">Scan Date & Time</th>
                                    <th className="px-8 py-4">Safety status</th>
                                    <th className="px-8 py-4">Risk Score</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 bg-surface-container-lowest">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-on-surface-variant font-medium">
                                            No history available yet. Try running an AI prediction.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center p-1 ${item.status === 'Spoiled' ? 'bg-error-container/20 border-error/10' : 'bg-primary-container/20 border-primary/10'}`}>
                                                        <span className="material-symbols-outlined text-2xl" style={{ color: item.status === 'Spoiled' ? 'red' : 'green' }}>
                                                            {item.status === 'Spoiled' ? 'dangerous' : 'inventory_2'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-on-surface">{item.foodType}</div>
                                                        <div className="text-xs text-on-surface-variant">ID: {item.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-semibold text-on-surface">{item.date.split(' ')[0]}</div>
                                                <div className="text-xs text-on-surface-variant">{item.date.split(' ')[1] || ''}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Spoiled' ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-on-primary-container'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Spoiled' ? 'bg-error' : 'bg-primary'}`}></span>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className={`px-8 py-6 font-headline font-bold ${item.status === 'Spoiled' ? 'text-error' : 'text-primary'}`}>
                                                {item.riskScore}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="text-on-surface-variant hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
