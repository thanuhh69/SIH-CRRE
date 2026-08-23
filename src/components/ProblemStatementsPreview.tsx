'use client';

import React from 'react';
import { ExternalLink, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { OFFICIAL_SIH_PORTAL_URL } from '@/data/placeholder';

export default function ProblemStatementsPreview() {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="bg-white rounded-2xl border-2 border-college-gold p-8 md:p-12 shadow-xl space-y-6 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-college-navy/90 text-college-gold font-mono text-xs font-bold px-3.5 py-1.5 rounded-full border border-college-gold/40 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-college-gold" />
            <span>OFFICIAL SMART INDIA HACKATHON PORTAL</span>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif font-extrabold text-2xl md:text-3xl lg:text-4xl text-college-navy">
              Smart India Hackathon Problem Statements
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Problem statements for SIH 2026 are released directly by Ministries, State Departments, and Industry Partners on the official Smart India Hackathon national web portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-lg">🏛️</span>
              <div className="font-serif font-bold text-xs text-college-navy mt-1">Union Ministries</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Central Government Challenges</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-lg">🏭</span>
              <div className="font-serif font-bold text-xs text-college-navy mt-1">Industry Partners</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Private Enterprise Problems</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-lg">💡</span>
              <div className="font-serif font-bold text-xs text-college-navy mt-1">Software & Hardware</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Two Core Categories</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href={OFFICIAL_SIH_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-college-navy to-college-blue text-white px-8 py-3.5 rounded-xl font-extrabold text-xs tracking-wider shadow-lg hover:bg-college-blue transition-all border border-college-gold/30 hover:scale-105"
            >
              <span>VIEW OFFICIAL SIH PROBLEM STATEMENTS</span>
              <ExternalLink className="w-4 h-4 text-college-gold" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
