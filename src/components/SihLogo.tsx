'use client';

import React from 'react';

export default function SihLogo({ className = 'w-64 h-64' }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-college-gold/30 to-emerald-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />
      
      {/* Logo Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border-2 border-college-gold/40 shadow-2xl group hover:border-college-gold transition-all duration-300">
        <img
          src="/sih-logo.png"
          alt="Smart India Hackathon Official Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(197,155,39,0.35)] group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}
