'use client';

import React from 'react';
import Link from 'next/link';
import SihLogo from '@/components/SihLogo';
import { ArrowRight, Shield, Lightbulb, Users, Award, ChevronRight, Sparkles } from 'lucide-react';
import { HERO_DATA } from '@/data/placeholder';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-college-dark via-college-navy to-college-dark text-white pt-10 pb-16 overflow-hidden border-b-4 border-college-gold">
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#c59b27 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Top Institutional Badge */}
        <div className="flex justify-center md:justify-start mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-college-gold/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-college-goldLight shadow-inner">
            <Shield className="w-3.5 h-3.5 text-college-gold" />
            <span>{HERO_DATA.collegeName} {HERO_DATA.collegeStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-center md:text-left space-y-5">
            <div>
              <div className="inline-block font-mono text-xs md:text-sm font-bold text-college-gold uppercase tracking-widest bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30 mb-3">
                {HERO_DATA.subtitle}
              </div>
              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                {HERO_DATA.title}
              </h1>
            </div>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              "{HERO_DATA.tagline}"
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-college-gold via-amber-500 to-college-gold text-college-dark px-7 py-3.5 rounded font-bold text-sm shadow-lg hover:brightness-110 transition-all transform hover:-translate-y-0.5 border border-amber-300"
              >
                <span>REGISTER YOUR TEAM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded font-semibold text-sm border border-white/20 transition-colors"
              >
                <span>EXPLORE SIH</span>
                <ChevronRight className="w-4 h-4 text-college-gold" />
              </Link>
            </div>

            {/* Sub-highlights bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-college-blue text-college-gold">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">Innovation</div>
                  <div className="text-[10px] text-slate-300">Real Problems</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-college-blue text-college-gold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">Teamwork</div>
                  <div className="text-[10px] text-slate-300">6 Members/Team</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-college-blue text-college-gold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">National</div>
                  <div className="text-[10px] text-slate-300">Grand Finale</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Official SIH Logo Emblem */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm shadow-2xl relative flex flex-col items-center">
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-college-navy/90 px-2.5 py-1 rounded text-[10px] text-college-gold font-mono font-semibold border border-college-gold/30">
                <Sparkles className="w-3 h-3 text-college-gold animate-pulse" />
                <span>OFFICIAL SIH 2026 EMBLEM</span>
              </div>
              <div className="w-full flex items-center justify-center gap-4 my-3 pt-6">
                <img
                  src="/sih-logo.png"
                  alt="Official SIH Lightbulb Logo"
                  className="h-64 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-center text-[11px] text-slate-300 font-serif font-bold tracking-wide mt-2">
                Sir C.R. Reddy College of Engineering (Autonomous)
              </div>
              <div className="text-center text-[10px] text-college-gold font-mono mt-0.5">
                Official Hackathon Portal · Eluru, AP
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
