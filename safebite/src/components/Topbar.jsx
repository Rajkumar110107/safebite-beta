import React from 'react';

export default function Topbar() {
    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-2xl border-b border-slate-100/50 z-40 flex justify-between items-center px-8">
            <div className="flex items-center bg-surface-container-highest px-4 py-2 rounded-full w-96 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
                <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
                <input 
                    className="bg-transparent border-none focus:ring-0 text-sm w-full font-body outline-none" 
                    placeholder="Search safety logs..." 
                    type="text"
                />
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-full transition-all relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white"></span>
                    </button>
                    <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-full transition-all">
                        <span className="material-symbols-outlined">chat_bubble</span>
                    </button>
                    <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-full transition-all">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </div>
                
                <div className="w-px h-6 bg-slate-200"></div>
                
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs font-bold text-on-surface">Alex Rivera</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Safety Manager</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
