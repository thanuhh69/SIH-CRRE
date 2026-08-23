'use client';

import React from 'react';
import { Trophy, Cpu, Code2, ExternalLink, Sparkles, Calendar } from 'lucide-react';
import { PRIZE_DATA, OFFICIAL_SIH_PORTAL_URL } from '@/data/placeholder';

export default function PrizeMoneySection() {
  return (
    <section className="py-16 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-12">
        
        {/* Section Heading & Event Date Highlight */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-college-gold font-mono text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 text-college-gold" />
            <span>Event Dates: 15th & 16th September 2026</span>
          </div>

          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Internal Hackathon Prize Money
          </h2>

          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Sir C.R. Reddy College of Engineering is proud to award cash prizes to the top winning teams across both Software and Hardware categories in the SIH 2026 Internal Hackathon.
          </p>

          <div className="pt-2">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-college-gold px-6 py-2.5 rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-college-gold animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Prize Pool:</span>
              <span className="font-serif font-black text-2xl text-college-goldLight tracking-tight">
                {PRIZE_DATA.totalPool}
              </span>
            </div>
          </div>
        </div>

        {/* Prize Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* SOFTWARE CATEGORY */}
          <div className="bg-slate-800/90 rounded-2xl p-6 md:p-8 border-2 border-blue-500/30 hover:border-blue-400 transition-all shadow-xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/40">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">SOFTWARE</h3>
                    <p className="text-xs text-slate-400">Software Category Awards</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                  ₹22,000 Sub-Pool
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {PRIZE_DATA.software.map((prize) => (
                  <div 
                    key={prize.rank}
                    className="flex items-center justify-between p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/80 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{prize.medal}</span>
                      <span className="font-serif font-bold text-sm text-slate-200">{prize.rank}</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-college-gold">
                      {prize.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-center text-xs text-slate-400">
              Evaluated on innovation, code quality, and working prototype.
            </div>
          </div>

          {/* HARDWARE CATEGORY */}
          <div className="bg-slate-800/90 rounded-2xl p-6 md:p-8 border-2 border-purple-500/30 hover:border-purple-400 transition-all shadow-xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/40">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">HARDWARE</h3>
                    <p className="text-xs text-slate-400">Hardware Category Awards</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                  ₹22,000 Sub-Pool
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {PRIZE_DATA.hardware.map((prize) => (
                  <div 
                    key={prize.rank}
                    className="flex items-center justify-between p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/80 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{prize.medal}</span>
                      <span className="font-serif font-bold text-sm text-slate-200">{prize.rank}</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-college-gold">
                      {prize.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-center text-xs text-slate-400">
              Evaluated on physical circuit model, IoT telemetry, & feasibility.
            </div>
          </div>

        </div>

        {/* Prominent CTA Box to Redirect to Official SIH Portal */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-college-navy via-slate-800 to-college-navy p-6 md:p-8 rounded-2xl border-2 border-college-gold/60 text-center space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-2 text-college-gold font-mono text-xs font-bold uppercase tracking-wider bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30">
            <Trophy className="w-4 h-4" /> Ready to Compete?
          </div>

          <h3 className="font-serif font-bold text-xl md:text-2xl text-white">
            Explore Official SIH 2026 Problem Statements
          </h3>

          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            All problem statements are hosted directly on the official Smart India Hackathon portal by Union Ministries & Partner Industries.
          </p>

          <div className="pt-2 flex justify-center">
            <a
              href={OFFICIAL_SIH_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-college-gold via-amber-500 to-college-gold text-college-dark font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl hover:brightness-110 transition-all transform hover:-translate-y-0.5 border border-amber-300"
            >
              <span>View Official SIH Problem Statements</span>
              <ExternalLink className="w-4 h-4 text-college-dark" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
