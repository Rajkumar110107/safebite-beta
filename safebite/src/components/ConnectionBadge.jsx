import React from 'react';

export default function ConnectionBadge({ status }) {
    if (status === 'connected') {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/30 text-on-primary-fixed-variant rounded-full text-[11px] font-black tracking-widest uppercase mb-4 shadow-sm border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,166,118,0.8)]"></span>
                LIVE INFERENCE ENGINE
            </div>
        );
    }
    
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-error-container text-on-error-container rounded-full text-[11px] font-black tracking-widest uppercase mb-4 shadow-sm border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            DEVICE DISCONNECTED
        </div>
    );
}
