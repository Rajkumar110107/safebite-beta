import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { PRODUCT_DATABASE, lookupProductByCode } from '../services/productDatabase';

export default function ScanFood({ onNavigate }) {
  const {
    selectedProduct,
    setSelectedProduct,
    latestScanAssessment,
    performScreening,
    isEvaluating,
    addToInventory,
    backendDeviceStatus,
    liveTelemetry
  } = usePlatform();

  const [barcodeInput, setBarcodeInput] = useState(selectedProduct?.barcode || '');
  const [gasInput, setGasInput] = useState(liveTelemetry?.gas_value || 140);
  const [daysInput, setDaysInput] = useState(1);
  const [presenceInput, setPresenceInput] = useState(1);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Handle barcode search
  const handleBarcodeSearch = (code) => {
    setBarcodeInput(code);
    const prod = lookupProductByCode(code);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  // Run comprehensive screening
  const handleRunScreening = async () => {
    setSaveSuccessMsg('');
    await performScreening(selectedProduct, {
      gasValue: gasInput,
      storageDays: daysInput,
      presence: presenceInput
    });
  };

  // Add current scan to inventory
  const handleSaveToInventory = () => {
    if (!latestScanAssessment || !selectedProduct) return;
    const invItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      category: selectedProduct.category,
      batchId: latestScanAssessment.batchId,
      quantity: 1,
      unit: selectedProduct.packageSize,
      storageLocation: selectedProduct.storageType.includes('Refrigerated') ? 'Chiller Bay 1' : 'Pantry Shelf A',
      intakeDate: new Date().toISOString().split('T')[0],
      declaredExpiryDate: new Date(Date.now() + selectedProduct.defaultShelfLifeDays * 86400000).toISOString().split('T')[0],
      daysUntilDeclaredExpiry: selectedProduct.defaultShelfLifeDays,
      condition: latestScanAssessment.condition,
      foodConditionScore: latestScanAssessment.foodConditionScore,
      fefoPriority: latestScanAssessment.condition === 'SPOILED' ? 'EXPIRED_QUARANTINE' : latestScanAssessment.condition === 'CONSUME_SOON' ? 'URGENT' : 'LOW',
      status: 'IN_STOCK'
    };
    addToInventory(invItem);
    setSaveSuccessMsg(`Added "${selectedProduct.name}" to Active Inventory!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const getConditionColor = (cond) => {
    if (cond === 'SPOILED') {
      return {
        bg: 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/80 text-rose-900 dark:text-rose-200',
        badge: 'bg-rose-600 text-white',
        icon: 'dangerous'
      };
    }
    if (cond === 'CONSUME_SOON') {
      return {
        bg: 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/80 text-amber-900 dark:text-amber-200',
        badge: 'bg-amber-500 text-white',
        icon: 'warning'
      };
    }
    return {
      bg: 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900/80 text-emerald-900 dark:text-emerald-200',
      badge: 'bg-emerald-600 text-white',
      icon: 'check_circle'
    };
  };

  const conditionTheme = getConditionColor(latestScanAssessment?.condition);

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-8 sm:space-y-10 font-body transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 sm:p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl sm:text-2xl">qr_code_scanner</span>
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-headline">
              Central Screening Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
            Scan & Screen Food
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Combines digital product identification (QR/Barcode) with physical non-destructive condition screening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${backendDeviceStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {backendDeviceStatus === 'connected' ? 'Hardware COM Live' : 'Simulation Mode Ready'}
          </span>
        </div>
      </div>

      {/* 2-Column Screening Engine: Product Identifier (Left) + Hardware Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: Step 1 - Product Identification */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131c2e] p-5 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-headline font-black text-slate-900 dark:text-white text-sm sm:text-base">Product Identification</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Barcode / QR / Search</span>
            </div>

            {/* Quick-Pick Product Carousel */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Quick Pick Sample Foods</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRODUCT_DATABASE.slice(0, 8).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setBarcodeInput(prod.barcode);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                      selectedProduct?.id === prod.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{prod.image}</span>
                    <span className="text-[11px] font-bold line-clamp-1">{prod.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 uppercase font-mono">{prod.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Barcode Search Box */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Barcode / QR Code / Product Name</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">search</span>
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => handleBarcodeSearch(e.target.value)}
                    placeholder="Enter barcode or name (e.g. 8901262010015 or Milk)"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCameraActive
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  title="Simulate Camera QR Scanner"
                >
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  <span className="hidden sm:inline">{isCameraActive ? 'Camera ON' : 'Camera'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Camera Preview Box */}
            {isCameraActive && (
              <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-3 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Barcode Scanner Active
                  </span>
                  <button onClick={() => setIsCameraActive(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="h-32 rounded-xl bg-slate-900 border border-dashed border-emerald-500/50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                  <div className="w-48 h-0.5 bg-emerald-400 absolute animate-pulse shadow-[0_0_12px_#34d399]"></div>
                  <span className="material-symbols-outlined text-3xl text-emerald-400/80 mb-1">barcode_scanner</span>
                  <p className="text-[11px] text-slate-300">Align QR code / barcode within viewfinder</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleBarcodeSearch('8901262010015')}
                      className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 rounded text-[10px] text-white"
                    >
                      Scan Milk QR
                    </button>
                    <button
                      onClick={() => handleBarcodeSearch('8901262030013')}
                      className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 rounded text-[10px] text-white"
                    >
                      Scan Chicken QR
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Product Summary Card */}
          {selectedProduct && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3 sm:gap-4 transition-colors">
              <span className="text-3xl sm:text-4xl p-2 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm shrink-0">{selectedProduct.image}</span>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-mono truncate">{selectedProduct.brand} • {selectedProduct.category}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">{selectedProduct.packageSize}</span>
                </div>
                <h4 className="font-headline font-black text-slate-900 dark:text-white text-xs sm:text-sm truncate">{selectedProduct.name}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">{selectedProduct.ingredients}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedProduct.allergens.length > 0 ? (
                    selectedProduct.allergens.map((alg) => (
                      <span key={alg} className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Contains {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Allergen Safe
                    </span>
                  )}
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Shelf Life: {selectedProduct.defaultShelfLifeDays}d
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Step 2 - Physical Condition Screening */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131c2e] p-5 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 transition-colors">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-headline font-black text-slate-900 dark:text-white text-sm sm:text-base">Physical Condition Screening</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">MQ-135 + IR Sensor Stage</span>
            </div>

            {/* Live MQ-135 Gas Telemetry Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base">gas_meter</span>
                  MQ-135 Gas Sensor Reading
                </span>
                <span className="font-mono font-black text-base text-slate-900 dark:text-white">{gasInput} <span className="text-[10px] text-slate-400 uppercase">RAW</span></span>
              </div>
              <input
                type="range"
                min="50"
                max="950"
                value={gasInput}
                onChange={(e) => setGasInput(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-400">
                <span>🟢 50–200 (Fresh)</span>
                <span>🟡 201–450 (Warning)</span>
                <span>🔴 451–950 (Alert)</span>
              </div>
            </div>

            {/* Storage Duration & IR Presence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Storage Duration (Days)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDaysInput(Math.max(0, daysInput - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={daysInput}
                    onChange={(e) => setDaysInput(Number(e.target.value))}
                    className="w-full text-center font-headline font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl py-1 text-sm outline-none transition-colors"
                  />
                  <button
                    onClick={() => setDaysInput(daysInput + 1)}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">IR Sensor Trigger</label>
                <button
                  onClick={() => setPresenceInput(presenceInput === 1 ? 0 : 1)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    presenceInput === 1
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${presenceInput === 1 ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  {presenceInput === 1 ? 'Food Detected (IR:1)' : 'Empty (IR:0)'}
                </button>
              </div>
            </div>

            {/* Non-Destructive Screening Notice */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <span className="material-symbols-outlined text-slate-400 text-sm mt-0.5">info</span>
              <span>
                SafeBite performs non-destructive gas condition screening. Combine this screening with product label data for complete assessment.
              </span>
            </div>
          </div>

          {/* Screening Trigger Action */}
          <button
            onClick={handleRunScreening}
            disabled={isEvaluating || presenceInput === 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-headline font-black text-xs sm:text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none active:scale-95"
          >
            {isEvaluating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                <span>Evaluating Sensor Inference...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">fact_check</span>
                <span>RUN SAFEBITE CONDITION SCREENING</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* STEP 3: COMBINED COMPREHENSIVE RESULT DISPLAY */}
      {latestScanAssessment && (
        <div className={`p-5 sm:p-8 rounded-3xl border shadow-md space-y-6 transition-all ${conditionTheme.bg}`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">{selectedProduct?.image || '🍱'}</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Screening Result • ID: {latestScanAssessment.id}</span>
                <h3 className="font-headline font-black text-lg sm:text-xl text-slate-900 dark:text-white">{latestScanAssessment.productName}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${conditionTheme.badge}`}>
                <span className="material-symbols-outlined text-base">{conditionTheme.icon}</span>
                {latestScanAssessment.statusText}
              </span>
            </div>
          </div>

          {/* Assessment Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Food Condition Score */}
            <div className="bg-white dark:bg-[#131c2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Food Condition Score</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-3xl font-black font-headline text-slate-900 dark:text-white">{latestScanAssessment.foodConditionScore}</span>
                <span className="text-xs text-slate-400 font-bold">/100</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Non-destructive index</span>
            </div>

            {/* Observed Gas Response */}
            <div className="bg-white dark:bg-[#131c2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MQ-135 Gas Signature</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-3xl font-black font-headline text-slate-900 dark:text-white">{latestScanAssessment.gasValue}</span>
                <span className="text-xs text-slate-400 font-bold ml-1">RAW</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{latestScanAssessment.primaryIndicator}</span>
            </div>

            {/* Estimated Horizon */}
            <div className="bg-white dark:bg-[#131c2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Screening Horizon</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black font-headline text-slate-900 dark:text-white">{latestScanAssessment.timeRemaining}</span>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Prototype Estimate</span>
            </div>

            {/* Model Confidence */}
            <div className="bg-white dark:bg-[#131c2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Interpretation</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-3xl font-black font-headline text-slate-900 dark:text-white">{latestScanAssessment.confidence}</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Decision Support Confidence</span>
            </div>

          </div>

          {/* Action Recommendation Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg shrink-0">recommend</span>
              <span><strong>Action Recommendation:</strong> {latestScanAssessment.recommendation}</span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveToInventory}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                Save to Inventory
              </button>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Next Steps Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Explore Further:</span>
            <button
              onClick={() => onNavigate && onNavigate('Food Details')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              📋 Product & Allergen Details →
            </button>
            <button
              onClick={() => onNavigate && onNavigate('Nutrition')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              🥗 Nutrition Breakdown →
            </button>
            <button
              onClick={() => onNavigate && onNavigate('Food Condition')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              🧠 Explainable ML & Shelf-Life →
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
