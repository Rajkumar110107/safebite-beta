import React from 'react';

export default function GasBar({ value }) {
    // Normalize to percentage against maximum expected safe gas boundary 1023
    const safeMax = 1023;
    const boundedValue = Math.min(Math.max(value, 0), safeMax);
    const percentage = (boundedValue / safeMax) * 100;

    return (
        <div className="h-4 bg-surface-container-highest rounded-full overflow-hidden flex drop-shadow-inner border border-outline-variant/10">
            <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[inset_0_0_8px_rgba(0,0,0,0.1)] relative" 
                style={{ width: `${percentage}%` }}
            >
                {/* Glow effect on the tip */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/30"></div>
            </div>
        </div>
    );
}
