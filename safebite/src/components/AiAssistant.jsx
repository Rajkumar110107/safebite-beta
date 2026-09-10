import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function AiAssistant() {
  const { latestScanAssessment, selectedProduct } = usePlatform();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your SafeBite AI Food Assistant. I help you interpret food condition screening results, suggest rescue recipes for items approaching their limits, and recommend optimal storage protocols. How can I assist you today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const quickPrompts = [
    "What should I do with food marked Consume Soon?",
    "Give me safe recipes for overripe bananas or aging fruit",
    "How should I store dairy to maximize freshness?",
    "What are signs of physical meat spoilage?"
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent, category-grounded SafeBite AI response
    setTimeout(() => {
      let reply = "";
      const q = textToSend.toLowerCase();

      if (q.includes('consume soon') || q.includes('what should i do')) {
        reply = `When SafeBite classifies an item as **CONSUME SOON**:
1. **Immediate Consumption:** Cook or consume within the next 6–12 hours.
2. **Thermal Cooking:** High-temperature cooking (e.g. boiling milk to pasteurize, cooking poultry/fish to 75°C+) halts bacterial proliferation.
3. **Freezing:** If you cannot consume it today, portion and freeze immediately at -18°C.
4. **Culinary Repurposing:** Blend fruits into smoothies, turn bread into croutons/breadcrumbs, or make paneer/curry from aging milk.`;
      } else if (q.includes('recipe') || q.includes('banana') || q.includes('fruit')) {
        reply = `Here are 3 quick **Zero-Waste Rescue Ideas** for aging produce:
• **Ripe Banana Bread / Pancakes:** High natural sugar content makes softening bananas ideal for baked goods.
• **Compote or Jam:** Simmer aging apples or berries with a squeeze of lemon and a dash of cinnamon.
• **Freezer Smoothie Packs:** Peel, chop, and freeze fruit chunks in airtight containers for morning smoothies.`;
      } else if (q.includes('dairy') || q.includes('milk') || q.includes('store')) {
        reply = `**Optimal Dairy Storage Protocols:**
• Store milk and fresh paneer between **2°C and 4°C** in the main body of the refrigerator (never in the door, where temperature fluctuates).
• Keep containers tightly sealed to prevent absorption of ambient food odors and volatile airborne contaminants.
• Avoid leaving cartons on countertops during meal prep; return to the chiller immediately.`;
      } else if (q.includes('meat') || q.includes('chicken') || q.includes('spoilage')) {
        reply = `**Meat & Poultry Safety Guidelines:**
• If SafeBite flags **ALERT / SPOILED** with elevated ammonia/H2S gas patterns (MQ-135 >450 RAW), **discard immediately**. Cooking spoiled meat cannot destroy heat-stable bacterial toxins.
• Always separate raw meats from ready-to-eat produce to avoid cross-contamination.
• Store raw meats in leak-proof containers in the lowest chiller compartment.`;
      } else {
        reply = `Based on SafeBite screening guidelines: Always combine physical sensor telemetry with packaging best-before dates and your own sensory inspection (color, odor, texture). If a food item displays physical mold or pungent sour odors, discard it immediately.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="pt-24 px-6 md:px-10 pb-16 max-w-5xl mx-auto space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-teal-800 font-headline">
              Decision Support & AI Guidance
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-slate-900 tracking-tight">
            SafeBite AI Assistant
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Intelligent culinary advice, preservation strategies, and handling recommendations for perishables.
          </p>
        </div>

        {latestScanAssessment && (
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2">
            <span>{latestScanAssessment.image || '🍱'}</span>
            <span className="font-bold text-slate-800">{latestScanAssessment.productName}:</span>
            <span className="font-black text-emerald-700">{latestScanAssessment.statusText}</span>
          </div>
        )}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                m.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white shadow-sm'
              }`}>
                {m.sender === 'user' ? 'You' : 'AI'}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none whitespace-pre-line'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 shrink-0 cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask SafeBite AI about food safety, recipes, or storage..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <button
            onClick={() => handleSend()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <span>Ask</span>
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </div>

      </div>

      {/* Medical / Lab Disclaimers */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <strong className="text-slate-800">Safety Advisory:</strong> SafeBite AI provides culinary and preservation suggestions based on public food guidelines. It does not provide medical advice or substitute for laboratory testing. If in doubt regarding food spoilage or allergen safety, discard the item.
      </div>

    </div>
  );
}
