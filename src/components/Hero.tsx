'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Lightbulb, Users, Award, ChevronRight, ExternalLink, Calendar, Sparkles } from 'lucide-react';
import { HERO_DATA, OFFICIAL_SIH_PORTAL_URL } from '@/data/placeholder';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-college-dark via-college-navy to-college-dark text-white pt-8 sm:pt-10 pb-12 sm:pb-16 overflow-hidden border-b-4 border-college-gold">
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
        <div className="flex justify-center md:justify-start mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm border border-college-gold/40 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-college-goldLight shadow-inner max-w-full">
            <Shield className="w-3.5 h-3.5 text-college-gold shrink-0" />
            <span className="truncate">{HERO_DATA.collegeName} {HERO_DATA.collegeStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-center md:text-left space-y-4 sm:space-y-6">
            <div>
              <div className="inline-block font-mono text-[11px] sm:text-xs md:text-sm font-bold text-college-gold uppercase tracking-widest bg-college-gold/10 px-2.5 sm:px-3 py-1 rounded border border-college-gold/30 mb-2 sm:mb-3">
                SIH INTERNAL HACKATHON
              </div>
              <h1 className="font-serif font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                SMART INDIA<br className="hidden sm:inline" /> HACKATHON 2026
              </h1>
              
              {/* Prominent Event Dates Highlight */}
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-college-gold px-3.5 sm:px-4 py-2 rounded-xl text-amber-300 shadow-md max-w-full">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-college-gold shrink-0" />
                <div className="text-left font-mono">
                  <span className="text-[9px] sm:text-[10px] text-college-gold uppercase font-bold tracking-wider block">INTERNAL HACKATHON DATES</span>
                  <span className="font-serif font-bold text-xs sm:text-sm md:text-base text-white">📅 15th & 16th September 2026</span>
                </div>
              </div>
            </div>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-light italic mx-auto md:mx-0">
              "Innovation begins with identifying real-world problems and building meaningful solutions."
            </p>

            {/* Buttons CTA Section */}
            <div className="pt-1 sm:pt-2 space-y-3">
              {/* Row 1: REGISTER YOUR TEAM */}
              <div>
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-college-gold via-amber-500 to-college-gold text-college-dark px-6 sm:px-8 py-3.5 rounded font-extrabold text-xs sm:text-sm shadow-xl hover:brightness-110 transition-all transform hover:-translate-y-0.5 border border-amber-300 min-h-[44px]"
                >
                  <span>REGISTER YOUR TEAM</span>
                  <ArrowRight className="w-4 h-4 text-college-dark shrink-0" />
                </Link>
              </div>

              {/* Row 2: EXPLORE SIH & EXPLORE PROBLEM STATEMENTS */}
              <div className="flex flex-col xs:flex-row items-stretch sm:items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                <Link
                  href="/#about"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 sm:px-5 py-3 rounded font-semibold text-xs border border-white/20 transition-colors min-h-[44px]"
                >
                  <span>EXPLORE SIH</span>
                  <ChevronRight className="w-4 h-4 text-college-gold shrink-0" />
                </Link>

                <a
                  href={OFFICIAL_SIH_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-college-navy/90 hover:bg-college-blue text-college-goldLight px-4 sm:px-5 py-3 rounded font-semibold text-xs border border-college-gold/40 transition-colors shadow-md hover:border-college-gold min-h-[44px]"
                >
                  <span className="truncate">EXPLORE PROBLEM STATEMENTS</span>
                  <ExternalLink className="w-4 h-4 text-college-gold shrink-0" />
                </a>
              </div>
            </div>

            {/* Sub-highlights bar */}
            <div className="pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded sm:bg-transparent sm:p-0">
                <div className="p-1.5 rounded bg-college-blue text-college-gold shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">Innovation</div>
                  <div className="text-[10px] text-slate-300">Real Problems</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded sm:bg-transparent sm:p-0">
                <div className="p-1.5 rounded bg-college-blue text-college-gold shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">Teamwork</div>
                  <div className="text-[10px] text-slate-300">6 Members/Team</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded sm:bg-transparent sm:p-0">
                <div className="p-1.5 rounded bg-college-blue text-college-gold shrink-0">
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
          <div className="lg:col-span-5 flex justify-center mt-4 lg:mt-0">
            <div className="w-full max-w-sm sm:max-w-md bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm shadow-2xl relative flex flex-col items-center">
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-college-navy/90 px-2.5 py-1 rounded text-[10px] text-college-gold font-mono font-semibold border border-college-gold/30">
                <Sparkles className="w-3 h-3 text-college-gold animate-pulse" />
                <span>OFFICIAL SIH 2026 EMBLEM</span>
              </div>
              <div className="w-full flex items-center justify-center gap-4 my-2 sm:my-3 pt-6">
                <img
                  src="/sih-logo.png"
                  alt="Official SIH Lightbulb Logo"
                  className="max-h-48 sm:max-h-64 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform"
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
