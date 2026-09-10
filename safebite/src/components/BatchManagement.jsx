import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function BatchManagement({ onNavigate }) {
  const { batches, toggleBatchQuarantine } = usePlatform();
  const [selectedBatch, setSelectedBatch] = useState(batches[0] || null);

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">factory</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-800 font-headline">
              Industrial QA & Batch Control
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Batch Quality & Intake Inspection
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Centralized monitoring for high-volume handheld scanner inspections across warehouses and distribution hubs.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('Scan Food')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-base">barcode_reader</span>
          Audit New Lot / Unit
        </button>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {batches.map((batch) => {
          const isQuarantined = batch.quarantined;
          const scanPct = Math.round((batch.scannedUnits / batch.totalUnits) * 100);

          return (
            <div
              key={batch.batchId}
              onClick={() => setSelectedBatch(batch)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-5 flex flex-col justify-between ${
                selectedBatch?.batchId === batch.batchId
                  ? 'bg-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{batch.category} • {batch.arrivalDate}</span>
                    <h3 className="font-headline font-black text-slate-900 text-lg">{batch.productName}</h3>
                    <p className="text-xs font-mono text-indigo-600 font-bold">{batch.batchId}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isQuarantined ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {batch.status}
                  </span>
                </div>

                {/* Progress bar of scanned units */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Inspection Progress:</span>
                    <span className="font-bold text-slate-800">{batch.scannedUnits} / {batch.totalUnits} ({scanPct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-indigo-600 rounded-full" style={{ width: `${scanPct}%` }}></div>
                  </div>
                </div>

                {/* Condition Breakdown */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="block text-[10px] text-emerald-700">Fresh</span>
                    <span className="font-bold text-emerald-900">{batch.freshCount}</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="block text-[10px] text-amber-700">Warning</span>
                    <span className="font-bold text-amber-900">{batch.consumeSoonCount}</span>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="block text-[10px] text-rose-700">Spoiled</span>
                    <span className="font-bold text-rose-900">{batch.spoiledCount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600">Pass Rate: <strong className="text-slate-900 font-headline">{batch.qualityPassRate}%</strong></span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBatchQuarantine(batch.batchId);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isQuarantined
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                >
                  {isQuarantined ? 'Release Hold' : 'Flag Quarantine'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Batch Detailed Dossier */}
      {selectedBatch && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Batch Intake Dossier</span>
              <h3 className="text-2xl font-black font-headline text-slate-900">{selectedBatch.productName} — {selectedBatch.batchId}</h3>
              <p className="text-xs text-slate-500 font-medium">Origin: <strong>{selectedBatch.originFacility}</strong> • Received: <strong>{selectedBatch.arrivalDate}</strong></p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 font-mono">Lot Compliance Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${selectedBatch.quarantined ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {selectedBatch.quarantined ? 'Quarantine Active' : 'Pass / Cleared for Sale'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Lot Volume</span>
              <span className="text-2xl font-black font-headline text-slate-900">{selectedBatch.totalUnits} Units</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Passed Screening</span>
              <span className="text-2xl font-black font-headline text-emerald-900">{selectedBatch.freshCount} Units</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-700 font-bold uppercase block">Approaching Threshold</span>
              <span className="text-2xl font-black font-headline text-amber-900">{selectedBatch.consumeSoonCount} Units</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] text-rose-700 font-bold uppercase block">Defect / Spoilage</span>
              <span className="text-2xl font-black font-headline text-rose-900">{selectedBatch.spoiledCount} Units</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Industrial inspectors use the SafeBite Handheld Gun scanner to physically inspect lots at receipt bay. Results are aggregated to determine batch quality percentage and quarantine thresholds prior to shelf distribution.
          </p>
        </div>
      )}

    </div>
  );
}
