import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function Inventory({ onNavigate }) {
  const { inventory, updateInventoryItem, deleteInventoryItem } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filteredItems = inventory.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchCond = selectedCondition === 'All' || item.condition === selectedCondition;
    const matchSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || item.batchId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchCond && matchSearch;
  });

  // Sort by FEFO (First Expire, First Out: items with fewer days left or higher urgency come first)
  const sortedItems = [...filteredItems].sort((a, b) => {
    const urgencyOrder = { EXPIRED_QUARANTINE: 0, URGENT: 1, MEDIUM: 2, LOW: 3 };
    const urgA = urgencyOrder[a.fefoPriority] !== undefined ? urgencyOrder[a.fefoPriority] : 4;
    const urgB = urgencyOrder[b.fefoPriority] !== undefined ? urgencyOrder[b.fefoPriority] : 4;
    if (urgA !== urgB) return urgA - urgB;
    return (a.daysUntilDeclaredExpiry || 0) - (b.daysUntilDeclaredExpiry || 0);
  });

  const totalUnits = inventory.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);
  const urgentCount = inventory.filter((i) => i.fefoPriority === 'URGENT').length;
  const spoiledCount = inventory.filter((i) => i.condition === 'SPOILED').length;
  const freshCount = inventory.filter((i) => i.condition === 'FRESH').length;

  const exportCSV = () => {
    const headers = "ID,Product,Category,Batch,Quantity,Location,Condition,FoodScore,ExpiryDate,FEFO_Priority\n";
    const rows = inventory.map(i => `"${i.id}","${i.productName}","${i.category}","${i.batchId}","${i.quantity} ${i.unit}","${i.storageLocation}","${i.condition}",${i.foodConditionScore},"${i.declaredExpiryDate}","${i.fefoPriority}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safebite_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-7xl mx-auto space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 font-headline">
              Intelligent Inventory Control
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            Inventory & FEFO Priority Queue
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Prioritizes consumption using <strong>FEFO (First Expire, First Out)</strong> and real-time SafeBite condition screening scores.
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
            Scan & Add Item
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Tracked Inventory</span>
          <div className="my-1">
            <span className="text-3xl font-black font-headline text-slate-900">{totalUnits}</span>
            <span className="text-xs text-slate-500 ml-1">items / units</span>
          </div>
          <span className="text-[11px] text-slate-500">{inventory.length} distinct food lines</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono">Fresh & Stable</span>
          <div className="my-1">
            <span className="text-3xl font-black font-headline text-emerald-600">{freshCount}</span>
            <span className="text-xs text-slate-500 ml-1">lots</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Optimal condition</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider font-mono">FEFO Urgent Priority</span>
          <div className="my-1">
            <span className="text-3xl font-black font-headline text-amber-600">{urgentCount}</span>
            <span className="text-xs text-slate-500 ml-1">lots</span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Consume / sell immediately</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider font-mono">Quarantined / Alert</span>
          <div className="my-1">
            <span className="text-3xl font-black font-headline text-rose-600">{spoiledCount}</span>
            <span className="text-xs text-slate-500 ml-1">lots</span>
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Isolated from distribution</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Dairy', 'Fruits', 'Meat', 'Bakery', 'Packaged'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Condition Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="All">All Conditions</option>
            <option value="FRESH">🟢 Fresh</option>
            <option value="CONSUME_SOON">🟡 Consume Soon</option>
            <option value="SPOILED">🔴 Alert / Spoiled</option>
          </select>

          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-headline font-black text-slate-900 text-base">Active Food Inventory Log</h3>
          <span className="text-xs font-mono text-slate-500">{sortedItems.length} records matching</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-bold">Food Item & Batch</th>
                <th className="px-6 py-3 font-bold">Location</th>
                <th className="px-6 py-3 font-bold">Quantity</th>
                <th className="px-6 py-3 font-bold">Condition & Score</th>
                <th className="px-6 py-3 font-bold">FEFO Priority</th>
                <th className="px-6 py-3 font-bold">Declared Expiry</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-headline font-black text-slate-900 text-sm">{item.productName}</span>
                        <div className="text-[10px] font-mono text-slate-400">{item.batchId} • {item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{item.storageLocation}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.quantity} <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.condition === 'SPOILED' ? 'bg-rose-100 text-rose-800' : item.condition === 'CONSUME_SOON' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.condition === 'SPOILED' ? '🔴 Spoiled' : item.condition === 'CONSUME_SOON' ? '🟡 Consume Soon' : '🟢 Fresh'}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-600">{item.foodConditionScore}/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        item.fefoPriority === 'EXPIRED_QUARANTINE' ? 'bg-rose-600 text-white' : item.fefoPriority === 'URGENT' ? 'bg-amber-500 text-white animate-pulse' : item.fefoPriority === 'MEDIUM' ? 'bg-slate-200 text-slate-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.fefoPriority}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <div>{item.declaredExpiryDate}</div>
                      <div className="text-[10px] text-slate-400">{item.daysUntilDeclaredExpiry} day(s) left</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold cursor-pointer"
                          title="Consume or Remove"
                        >
                          Mark Consumed
                        </button>
                      </div>
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
