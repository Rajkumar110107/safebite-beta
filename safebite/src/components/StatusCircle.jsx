import React from 'react';

export default function StatusCircle({ status, recommendation }) {
    const isError = status === 'Spoiled';
    const isWarning = status === 'Consume Soon';
    const isFresh = status === 'Fresh' || status === 'No Food Detected';

    const renderTextClass = isError ? 'text-error' : isWarning ? 'text-orange-500' : 'text-on-surface';
    const renderPillClass = isFresh ? 'bg-primary-fixed-dim/20 text-on-primary-fixed-variant' : isWarning ? 'bg-orange-100 text-orange-800' : 'bg-error-container text-on-error-container';
    
    // Determine circle array dashes for animations
    const dashOffset = status === 'Fresh' ? "20" : status === 'Consume Soon' ? "100" : status === 'No Food Detected' ? "283" : "283";

    return (
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_40px_rgba(24,28,30,0.06)] border border-white/50 flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-8">AI Status Prediction</p>
            <div className="relative w-48 h-48 flex items-center justify-center mb-6 drop-shadow-md">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle className="text-surface-container" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8"></circle>
                    <circle 
                        cx="50" cy="50" fill="none" r="45" 
                        stroke={isFresh ? 'url(#gradient-green)' : isWarning ? 'url(#gradient-yellow)' : '#ba1a1a'} 
                        strokeDasharray="283" 
                        strokeDashoffset={dashOffset} 
                        strokeLinecap="round" strokeWidth="8"
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out, stroke 1s ease-out' }}>
                    </circle>
                    <defs>
                        <linearGradient id="gradient-green" x1="0%" x2="100%" y1="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#006c4b' }}></stop>
                            <stop offset="100%" style={{ stopColor: '#00a676' }}></stop>
                        </linearGradient>
                        <linearGradient id="gradient-yellow" x1="0%" x2="100%" y1="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#f59e0b' }}></stop>
                            <stop offset="100%" style={{ stopColor: '#fbbf24' }}></stop>
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl text-center px-4 font-black tracking-tighter leading-tight ${renderTextClass}`}>
                        {status}
                    </span>
                </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-500 shadow-inner ${renderPillClass}`}>
                {recommendation}
            </div>
        </div>
    );
}
