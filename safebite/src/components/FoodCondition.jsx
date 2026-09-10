import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { PRODUCT_DATABASE } from '../services/productDatabase';

export default function FoodCondition({ onNavigate }) {
  const { latestScanAssessment, selectedProduct } = usePlatform();
  const assessment = latestScanAssessment;
  const product = selectedProduct || PRODUCT_DATABASE[0];

  const getConditionBadge = (cond) => {
    if (cond === 'SPOILED') return { label: 'ALERT / SPOILED', color: 'bg-rose-600 text-white', icon: 'dangerous', text: 'text-rose-600', ring: 'ring-rose-400' };
    if (cond === 'CONSUME_SOON') return { label: 'CONSUME SOON', color: 'bg-amber-500 text-white', icon: 'warning', text: 'text-amber-600', ring: 'ring-amber-400' };
    return { label: 'FRESH', color: 'bg-emerald-600 text-white', icon: 'check_circle', text: 'text-emerald-600', ring: 'ring-emerald-400' };
  };

  const badge = getConditionBadge(assessment?.condition);

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-6xl mx-auto space-y-10 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">health_and_safety</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-teal-800 font-headline">
              Condition & Shelf-Life Intelligence
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Food Condition Assessment
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Interprets physical gas telemetry against food category baselines to provide explainable condition screening.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('Scan Food')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">qr_code_scanner</span>
          Perform New Scan
        </button>
      </div>

      {assessment ? (
        <div className="space-y-8">
          
          {/* Main Assessment Hero Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-5xl p-3 bg-slate-50 rounded-2xl border border-slate-200">{assessment.image || product.image}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Scan Log: {assessment.id}</span>
                    <span className="text-[10px] font-mono text-slate-400">• {assessment.timestamp}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-headline text-slate-900">{assessment.productName}</h2>
                  <p className="text-xs text-slate-500 font-medium">Category: <strong className="text-slate-800">{assessment.category}</strong> • Batch: <strong className="text-slate-800">{assessment.batchId}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md ${badge.color}`}>
                  <span className="material-symbols-outlined text-lg">{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              </div>
            </div>

            {/* CRITICAL: DECLARED SHELF LIFE vs OBSERVED CONDITION COMPARISON */}
            <div className="space-y-3">
              <h3 className="font-headline font-black text-slate-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">compare_arrows</span>
                Declared Date Horizon vs Observed Physical Condition
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Declared Shelf Life */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono">Declared Label Expiry</span>
                    <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black font-headline text-slate-800">
                      {product.defaultShelfLifeDays} Days Standard Shelf-Life
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Based on standard manufacturer declared best-before date assuming optimal continuous cold chain storage.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-500 font-mono">
                    Storage Requirement: {product.storageType}
                  </div>
                </div>

                {/* SafeBite Observed Condition */}
                <div className={`p-6 rounded-2xl border space-y-3 ${assessment.condition === 'SPOILED' ? 'bg-rose-50 border-rose-200' : assessment.condition === 'CONSUME_SOON' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-black uppercase tracking-wider font-mono text-slate-600">SafeBite Observed Screening</span>
                    <span className="material-symbols-outlined text-emerald-700">sensors</span>
                  </div>
                  <div className="space-y-1">
                    <p className={`text-2xl font-black font-headline ${badge.text}`}>
                      {badge.label}
                    </p>
                    <p className="text-xs text-slate-700 font-medium">
                      Physical screening detected <strong>{assessment.gasValue} RAW gas response</strong> after <strong>{assessment.storageDays} day(s)</strong> of storage.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-600">
                    <strong>Action Horizon:</strong> {assessment.timeRemaining}
                  </div>
                </div>

              </div>
            </div>

            {/* EXPLAINABLE ML: Why did this result occur? */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">psychology</span>
                  <h3 className="font-headline font-black text-sm tracking-wide text-slate-100">
                    Explainable Machine Learning Interpretation
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                  Model Confidence: {assessment.confidence}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Gas Indicator</span>
                  <p className="text-xs text-slate-200 font-medium">{assessment.primaryIndicator}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Food Condition Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-headline text-emerald-400">{assessment.foodConditionScore}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Calculated Risk Index</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-headline text-amber-400">{Math.round(assessment.riskScore * 100)}%</span>
                    <span className="text-xs text-slate-400">spoilage probability</span>
                  </div>
                </div>

              </div>

              {/* Explainable Factor Breakdown */}
              {assessment.explainableFactors && assessment.explainableFactors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Decision Factor Breakdown</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {assessment.explainableFactors.map((f, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex justify-between items-center">
                        <span className="text-slate-300 font-medium">{f.factor}:</span>
                        <span className={`font-mono font-bold ${f.impact === 'Positive' ? 'text-emerald-400' : f.impact === 'Warning' ? 'text-amber-400' : f.impact === 'Negative' ? 'text-rose-400' : 'text-slate-400'}`}>
                          {f.observation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regulatory & Safety Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="material-symbols-outlined text-slate-500 text-base">info</span>
                <span>Decision Support Disclaimer</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                SafeBite is an intelligent physical condition screening and decision-support tool. It measures non-destructive volatile gas signatures and storage durations. It does NOT replace professional laboratory microbiological or chemical food-safety testing. Always exercise sensory caution (smell, visual mold, packaging integrity) before consuming.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-slate-300">qr_code_scanner</span>
          <h3 className="text-xl font-bold font-headline text-slate-800">No Active Screening Assessment</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Scan a food barcode or run a physical hardware condition screening to view explainable ML condition analytics.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('Scan Food')}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs"
          >
            Start Scan
          </button>
        </div>
      )}

    </div>
  );
}
