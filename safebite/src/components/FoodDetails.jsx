import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { PRODUCT_DATABASE } from '../services/productDatabase';

export default function FoodDetails({ onNavigate }) {
  const { selectedProduct, setSelectedProduct, latestScanAssessment } = usePlatform();
  const product = selectedProduct || PRODUCT_DATABASE[0];

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-6xl mx-auto space-y-10 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-teal-800 font-headline">
              Product Identity & Safety Registry
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Food Product Details
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Verified product specifications, declared ingredients, allergen alerts, and packaging information.
          </p>
        </div>

        {/* Product Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Select Item:</label>
          <select
            value={product.id}
            onChange={(e) => {
              const found = PRODUCT_DATABASE.find((p) => p.id === e.target.value);
              if (found) setSelectedProduct(found);
            }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
          >
            {PRODUCT_DATABASE.map((p) => (
              <option key={p.id} value={p.id}>
                {p.image} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
        
        {/* Top Product Hero Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <span className="text-6xl p-4 bg-emerald-50 rounded-3xl border border-emerald-100 shadow-sm">{product.image}</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider font-mono">
                  {product.brand}
                </span>
                <span className="text-xs font-mono text-slate-400">Barcode: {product.barcode}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-headline text-slate-900">{product.name}</h2>
              <p className="text-xs text-slate-500">Category: <strong className="text-slate-800">{product.category}</strong> • Standard Pack: <strong className="text-slate-800">{product.packageSize}</strong></p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {product.dietaryFlags.map((flag) => (
              <span key={flag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                ✓ {flag}
              </span>
            ))}
          </div>
        </div>

        {/* Allergen & Dietary Warning Section */}
        <div className="space-y-3">
          <h3 className="font-headline font-black text-slate-900 text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">warning</span>
            Allergen & Health Information
          </h3>

          {product.allergens.length > 0 ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>Active Allergen Warning</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                This food product contains or may contain: <strong>{product.allergens.join(', ')}</strong>. Individuals with specific food allergies or sensitivities should avoid consumption.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
                <span>No Common Allergens Declared</span>
              </div>
              <p className="text-xs font-medium">
                No major allergens (Milk, Eggs, Peanuts, Tree Nuts, Fish, Crustaceans, Wheat, Soy) declared on primary packaging registry.
              </p>
            </div>
          )}

          {/* Non-Sensor Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <span className="material-symbols-outlined text-slate-400 text-sm mt-0.5">info</span>
            <span>
              <strong>Regulatory Notice:</strong> Ingredients and allergen disclosures are retrieved directly from certified food labeling databases and packaging registries. Physical gas sensors (MQ-135) screen gaseous conditions and do NOT detect protein allergens.
            </span>
          </div>
        </div>

        {/* Detailed Product Specification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Ingredients Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-headline font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">format_list_bulleted</span>
              Declared Ingredients
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-200/80 shadow-inner">
              {product.ingredients}
            </p>
            <div className="text-[11px] text-slate-500">
              <strong>Additives / Preservatives:</strong> {product.additives}
            </div>
          </div>

          {/* Storage & Shelf-Life Protocol */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-headline font-black text-slate-900 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">thermostat</span>
              Prescribed Storage Conditions
            </h4>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Storage Modality:</span>
                <span className="font-bold text-slate-900">{product.storageType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Recommended Temperature:</span>
                <span className="font-bold text-slate-900">{product.recommendedStorageTemp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Recommended Humidity:</span>
                <span className="font-bold text-slate-900">{product.recommendedStorageHumidity}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Declared Fresh Horizon:</span>
                <span className="font-bold text-emerald-700">{product.defaultShelfLifeDays} Days</span>
              </div>
            </div>
          </div>

        </div>

        {/* Cross Navigation Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('Scan Food')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              Scan This Product
            </button>
            <button
              onClick={() => onNavigate && onNavigate('Nutrition')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">nutrition</span>
              Nutrition Calculator
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">Database Entry: #{product.id}</span>
        </div>

      </div>

    </div>
  );
}
