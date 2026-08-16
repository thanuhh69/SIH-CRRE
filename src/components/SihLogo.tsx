'use client';

import React from 'react';

export default function SihLogo({ className = 'w-72 h-72' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute inset-4 bg-gradient-to-tr from-amber-500/20 via-college-gold/25 to-emerald-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

      {/* Pure Vector SVG Logo - 100% Transparent Background */}
      <svg
        viewBox="0 0 500 550"
        className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff8c00" />
            <stop offset="100%" stopColor="#e65100" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Outer Lightbulb Rays */}
        <g stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" opacity="0.85">
          <line x1="250" y1="20" x2="250" y2="55" />
          <line x1="140" y1="65" x2="162" y2="92" />
          <line x1="360" y1="65" x2="338" y2="92" />
          <line x1="60" y1="170" x2="95" y2="182" />
          <line x1="440" y1="170" x2="405" y2="182" />
          <line x1="40" y1="290" x2="78" y2="290" />
          <line x1="460" y1="290" x2="422" y2="290" />
          <line x1="80" y1="410" x2="110" y2="390" />
          <line x1="420" y1="410" x2="390" y2="390" />
        </g>

        {/* LEFT BRAIN HALF (Saffron / Circuit Board) */}
        <g>
          {/* Lobe Outer Silhouette */}
          <path
            d="M 245,85 C 200,85 160,110 145,145 C 130,175 135,210 150,235 C 135,255 130,285 145,315 C 160,345 190,365 245,375 Z"
            fill="url(#saffronGrad)"
            stroke="#b33600"
            strokeWidth="3"
          />
          {/* Circuit Board Trace Lines */}
          <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
            <path d="M 180,130 L 195,130 L 210,150 L 235,150" />
            <circle cx="180" cy="130" r="4" fill="#ffffff" />
            <circle cx="235" cy="150" r="4" fill="#ffffff" />

            <path d="M 160,180 L 185,180 L 200,200 L 240,200" />
            <circle cx="160" cy="180" r="4" fill="#ffffff" />
            <circle cx="240" cy="200" r="4" fill="#ffffff" />

            <path d="M 155,240 L 175,240 L 190,225 L 230,225" />
            <circle cx="155" cy="240" r="4" fill="#ffffff" />

            <path d="M 170,290 L 195,290 L 210,270 L 240,270" />
            <circle cx="170" cy="290" r="4" fill="#ffffff" />
            <circle cx="240" cy="270" r="4" fill="#ffffff" />

            <path d="M 190,340 L 210,340 L 225,320 L 240,320" />
            <circle cx="190" cy="340" r="4" fill="#ffffff" />
          </g>
        </g>

        {/* RIGHT BRAIN HALF (Green / Binary Code) */}
        <g>
          {/* Lobe Outer Silhouette */}
          <path
            d="M 255,85 C 300,85 340,110 355,145 C 370,175 365,210 350,235 C 365,255 370,285 355,315 C 340,345 310,365 255,375 Z"
            fill="url(#greenGrad)"
            stroke="#03543f"
            strokeWidth="3"
          />
          {/* Binary Code Digits */}
          <g fill="#ffffff" fontFamily="monospace" fontWeight="bold" fontSize="19" opacity="0.95">
            <text x="270" y="130">10101</text>
            <text x="270" y="165">010101</text>
            <text x="270" y="200">101010</text>
            <text x="270" y="235">0101011</text>
            <text x="270" y="270">101010</text>
            <text x="270" y="305">010101</text>
            <text x="270" y="340">10101</text>
          </g>
        </g>

        {/* CENTER FILAMENT & BULB SHIELD */}
        <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round">
          <path d="M 230,370 L 235,320 Q 250,300 265,320 L 270,370" fill="none" opacity="0.8" />
          <circle cx="250" cy="305" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        </g>

        {/* BULB BASE (Metallic Threaded Screw Base) */}
        <g>
          <path
            d="M 200,380 L 300,380 L 295,400 L 205,400 Z"
            fill="url(#metalGrad)"
            stroke="#334155"
            strokeWidth="2"
          />
          <path
            d="M 205,405 L 295,405 L 290,425 L 210,425 Z"
            fill="url(#metalGrad)"
            stroke="#334155"
            strokeWidth="2"
          />
          <path
            d="M 212,430 L 288,430 L 280,450 L 220,450 Z"
            fill="url(#metalGrad)"
            stroke="#334155"
            strokeWidth="2"
          />
          <path
            d="M 225,455 Q 250,475 275,455 Z"
            fill="#1e293b"
          />
        </g>

        {/* SWOOSH ACCENTS UNDER BASE */}
        <path
          d="M 180,440 Q 210,480 240,465"
          stroke="#f97316"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 320,440 Q 290,480 260,465"
          stroke="#10b981"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* SIH TYPOGRAPHY AT BOTTOM */}
        <g>
          <text
            x="250"
            y="525"
            textAnchor="middle"
            fill="#e2e8f0"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="48"
            letterSpacing="6"
          >
            SiH
          </text>
        </g>
      </svg>
    </div>
  );
}
