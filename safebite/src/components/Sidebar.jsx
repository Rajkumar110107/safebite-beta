import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
    const navItems = [
        { name: 'Dashboard', icon: 'dashboard' },
        { name: 'Hardware', icon: 'developer_board' },
        { name: 'Sensors', icon: 'sensors' },
        { name: 'History', icon: 'history' },
        { name: 'Alerts', icon: 'notifications_active' },
        { name: 'AI Insights', icon: 'psychology' },
    ];

    const sysItems = [
        { name: 'Settings', icon: 'settings' },
        { name: 'Profile', icon: 'account_circle' },
        { name: 'About', icon: 'info' }
    ];

    const baseItemClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-slate-500 font-medium hover:bg-emerald-50/50 hover:text-emerald-600 cursor-pointer";
    const activeItemClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 relative font-semibold text-emerald-700 before:content-[''] before:absolute before:left-0 before:w-1 before:h-6 before:bg-emerald-600 before:rounded-full bg-emerald-50/50 cursor-pointer";

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50/80 backdrop-blur-3xl shadow-[0_12px_40px_rgba(24,28,30,0.06)] flex flex-col py-8 px-4 z-50">
            <div className="mb-12 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-emerald-900 tracking-tighter font-headline">SafeBite AI</h1>
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60 font-headline">The Living Laboratory</p>
                    </div>
                </div>
            </div>
            
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <a 
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={activeTab === item.name ? activeItemClass : baseItemClass}
                    >
                        <span className="material-symbols-outlined" style={activeTab === item.name ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                        <span className="font-['Manrope'] tracking-tight">{item.name}</span>
                    </a>
                ))}

                <div className="pt-8 pb-4">
                    <p className="px-4 text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-widest">System</p>
                </div>

                {sysItems.map((item) => (
                    <a 
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={activeTab === item.name ? activeItemClass : baseItemClass}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="font-['Manrope'] tracking-tight">{item.name}</span>
                    </a>
                ))}
            </nav>

            <div className="mt-auto px-2">
                <button className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 scale-[0.98] active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
                    Run Safety Audit
                </button>
            </div>
        </aside>
    );
}
