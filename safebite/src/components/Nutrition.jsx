import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { PRODUCT_DATABASE } from '../services/productDatabase';

export default function Nutrition({ onNavigate }) {
  const { selectedProduct, setSelectedProduct } = usePlatform();
  const product = selectedProduct || PRODUCT_DATABASE[0];

  // Dynamic Quantity state (in grams or ml, default 100)
  const [portionGrams, setPortionGrams] = useState(100);

  const n100 = product.nutritionPer100g;
  const multiplier = Math.max(1, portionGrams) / 100;

  const currentNutri = {
    calories: Math.round(n100.calories * multiplier),
    protein: (n100.protein * multiplier).toFixed(1),
    carbs: (n100.carbohydrates * multiplier).toFixed(1),
    fat: (n100.fat * multiplier).toFixed(1),
    satFat: (n100.saturatedFat * multiplier).toFixed(1),
    sugar: (n100.sugar * multiplier).toFixed(1),
    sodium: Math.round(n100.sodium * multiplier),
    calcium: Math.round(n100.calcium * multiplier),
    fiber: (n100.fiber * multiplier).toFixed(1)
  };

  const totalMacros = (Number(currentNutri.protein) + Number(currentNutri.carbs) + Number(currentNutri.fat)) || 1;
  const proteinPct = Math.round((Number(currentNutri.protein) / totalMacros) * 100);
  const carbsPct = Math.round((Number(currentNutri.carbs) / totalMacros) * 100);
  const fatPct = Math.round((Number(currentNutri.fat) / totalMacros) * 100);

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-6xl mx-auto space-y-10 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">nutrition</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 font-headline">
              Nutritional Intelligence Engine
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Nutrition & Portion Calculator
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Calculates verified macro & micronutrient profiles based on selected consumption portions.
          </p>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Food Item:</label>
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

      {/* Main Nutrition Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
        
        {/* Product Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-5xl p-3 bg-emerald-50 rounded-2xl border border-emerald-100">{product.image}</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 font-mono">{product.brand} • {product.category}</span>
              <h2 className="text-2xl font-black font-headline text-slate-900">{product.name}</h2>
              <p className="text-xs text-slate-500 font-medium">Standard Packaging: {product.packageSize}</p>
            </div>
          </div>

          {/* Quick Portion Presets */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {[50, 100, 250, 500].map((preset) => (
              <button
                key={preset}
                onClick={() => setPortionGrams(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  portionGrams === preset ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {preset}{product.unit}
              </button>
            ))}
          </div>
        </div>

        {/* Portion Size Interactive Slider */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">scale</span>
              Adjust Custom Portion Quantity
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="10"
                max="2000"
                value={portionGrams}
                onChange={(e) => setPortionGrams(Math.max(10, Number(e.target.value)))}
                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-sm font-black font-headline text-right outline-none"
              />
              <span className="text-xs font-bold text-slate-500">{product.unit}</span>
            </div>
          </div>

          <input
            type="range"
            min="25"
            max="1000"
            step="25"
            value={portionGrams}
            onChange={(e) => setPortionGrams(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>25 {product.unit} (Snack)</span>
            <span>100 {product.unit} (Standard Base)</span>
            <span>250 {product.unit} (Meal Portion)</span>
            <span>500 {product.unit} (Full Pack)</span>
            <span>1000 {product.unit} (Bulk)</span>
          </div>
        </div>

        {/* Big Macro KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Energy / Calories */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">Energy Intake</span>
            <div className="my-2">
              <span className="text-4xl font-black font-headline">{currentNutri.calories}</span>
              <span className="text-xs font-bold opacity-80 ml-1">kcal</span>
            </div>
            <span className="text-[11px] opacity-80">Per {portionGrams} {product.unit} portion</span>
          </div>

          {/* Protein */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-400">Protein</span>
            <div className="my-2">
              <span className="text-4xl font-black font-headline text-white">{currentNutri.protein}</span>
              <span className="text-xs font-bold text-slate-400 ml-1">g</span>
            </div>
            <span className="text-[11px] text-slate-400">{proteinPct}% of macro calories</span>
          </div>

          {/* Carbohydrates */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Carbohydrates</span>
            <div className="my-2">
              <span className="text-4xl font-black font-headline text-slate-900">{currentNutri.carbs}</span>
              <span className="text-xs font-bold text-slate-400 ml-1">g</span>
            </div>
            <span className="text-[11px] text-slate-500">Includes {currentNutri.sugar}g Sugar</span>
          </div>

          {/* Total Fat */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Total Fat</span>
            <div className="my-2">
              <span className="text-4xl font-black font-headline text-slate-900">{currentNutri.fat}</span>
              <span className="text-xs font-bold text-slate-400 ml-1">g</span>
            </div>
            <span className="text-[11px] text-slate-500">Includes {currentNutri.satFat}g Saturated</span>
          </div>

        </div>

        {/* Detailed Micronutrients & Composition Table */}
        <div className="space-y-4">
          <h3 className="font-headline font-black text-slate-900 text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">table_chart</span>
            Portion Nutritional Composition ({portionGrams} {product.unit})
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-bold">Nutrient Parameter</th>
                  <th className="px-6 py-3 font-bold text-right">Per 100 {product.unit} (Base)</th>
                  <th className="px-6 py-3 font-bold text-right text-emerald-700">Your Portion ({portionGrams} {product.unit})</th>
                  <th className="px-6 py-3 font-bold text-right">Daily Reference (% DV)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                <tr>
                  <td className="px-6 py-3.5 font-bold text-slate-900">Energy (Calories)</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.calories} kcal</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.calories} kcal</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((currentNutri.calories / 2000) * 100)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-bold text-slate-900">Protein</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.protein} g</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.protein} g</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((Number(currentNutri.protein) / 50) * 100)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-bold text-slate-900">Total Carbohydrates</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.carbohydrates} g</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.carbs} g</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((Number(currentNutri.carbs) / 275) * 100)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-600 pl-10">↳ Dietary Fiber</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.fiber} g</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.fiber} g</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((Number(currentNutri.fiber) / 28) * 100)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-600 pl-10">↳ Sugars</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.sugar} g</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.sugar} g</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-bold text-slate-900">Total Fat</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.fat} g</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.fat} g</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((Number(currentNutri.fat) / 78) * 100)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-600 pl-10">↳ Saturated Fat</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.saturatedFat} g</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.satFat} g</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((Number(currentNutri.satFat) / 20) * 100)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-bold text-slate-900">Calcium</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.calcium} mg</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.calcium} mg</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((currentNutri.calcium / 1300) * 100)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-bold text-slate-900">Sodium</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-500">{n100.sodium} mg</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-700">{currentNutri.sodium} mg</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">{Math.round((currentNutri.sodium / 2300) * 100)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mandatory Explicit Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span className="material-symbols-outlined text-slate-500 text-base">verified</span>
            <span>Nutritional Database Attribution Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Nutritional estimations are compiled from USDA National Nutrient Database & FSSAI standard reference values for {product.category.toLowerCase()} items. 
            <strong>SafeBite MQ-135 hardware sensors perform non-destructive volatile gas screening and do not measure caloric, carbohydrate, protein, sodium, or mineral quantities.</strong>
          </p>
        </div>

      </div>

    </div>
  );
}
