import React from 'react';

export default function SensorCard({ title, icon, valueText, valueSubtext, valueColorClass, children }) {
    return (
        <div className="space-y-4 group">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex items-center justify-center font-black text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors duration-300">
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-on-surface">{title}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-xl font-black ${valueColorClass || 'text-on-surface'}`}>
                        {valueText}
                    </span>
                    {valueSubtext && (
                        <span className="text-xs font-bold text-on-surface-variant/60 ml-1 tracking-wider uppercase">
                            {valueSubtext}
                        </span>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}
