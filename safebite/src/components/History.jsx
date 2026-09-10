import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function History({ onNavigate }) {
  const { scans } = usePlatform();
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCondition, setFilterCondition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScans = scans.filter((s) => {
    const matchCat = filterCategory === 'All' || s.category.toLowerCase() === filterCategory.toLowerCase();
    const matchCond = filterCondition === 'All' || s.condition === filterCondition;
    const matchSearch = s.productName.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchCond && matchSearch;
  });

  const exportCSV = () => {
    const headers = "ScanID,Timestamp,Product,Category,Batch,GasRAW,Condition,FoodScore,Confidence,Inspector\n";
    const rows = filteredScans.map(s => `"${s.id}","${s.timestamp}","${s.productName}","${s.category}","${s.batchId}",${s.gasValue},"${s.condition}",${s.foodConditionScore},"${s.confidence}","${s.inspector || 'System'}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safebite_scans_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">history</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-teal-800 font-headline">
              Audit & Screening Records
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Permanent Scan History
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Auditable log of all physical sensor screenings, barcode matches, and ML interpretation outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export CSV
          </button>
          <button
            onClick={() => onNavigate && onNavigate('Scan Food')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            New Inspection
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Dairy', 'Fruits', 'Meat', 'Bakery', 'Packaged'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="All">All Conditions</option>
            <option value="FRESH">🟢 Fresh</option>
            <option value="CONSUME_SOON">🟡 Consume Soon</option>
            <option value="SPOILED">🔴 Alert / Spoiled</option>
          </select>

          <input
            type="text"
            placeholder="Search scan ID or food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-headline font-black text-slate-900 text-base">Screening Ledger</h3>
          <span className="text-xs font-mono text-slate-500">{filteredScans.length} records preserved</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-bold">Scan ID & Timestamp</th>
                <th className="px-6 py-3 font-bold">Product & Category</th>
                <th className="px-6 py-3 font-bold">Gas Telemetry</th>
                <th className="px-6 py-3 font-bold">Screening Outcome</th>
                <th className="px-6 py-3 font-bold">Condition Score</th>
                <th className="px-6 py-3 font-bold text-right">Inspection Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No scan history matches your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-slate-900">{scan.id}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{scan.timestamp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-headline font-black text-slate-900 text-sm">{scan.productName}</span>
                      <div className="text-[10px] font-mono text-slate-400">{scan.category} • Batch: {scan.batchId}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span className="font-bold text-slate-900">{scan.gasValue} RAW</span>
                      <div className="text-[10px] text-slate-400">{scan.storageDays}d Storage</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        scan.condition === 'SPOILED' ? 'bg-rose-100 text-rose-800' : scan.condition === 'CONSUME_SOON' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {scan.statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-headline font-bold text-sm text-slate-900">{scan.foodConditionScore}/100</div>
                      <div className="text-[10px] text-slate-400 font-mono">{scan.confidence} Conf.</div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-500">
                      {scan.inspector || 'Self-Scan'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
