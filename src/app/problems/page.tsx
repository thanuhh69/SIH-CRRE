'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { OFFICIAL_SIH_PORTAL_URL } from '@/data/placeholder';

export default function ProblemsPage() {
  useEffect(() => {
    // Automatically redirect user to official SIH portal
    const timer = setTimeout(() => {
      window.location.href = OFFICIAL_SIH_PORTAL_URL;
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="bg-white max-w-xl w-full rounded-2xl border-2 border-college-gold p-8 md:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-college-navy/10 text-college-gold rounded-full flex items-center justify-center mx-auto border-2 border-college-gold">
            <ExternalLink className="w-8 h-8 text-college-gold" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold bg-college-gold/20 text-college-goldLight px-3 py-1 rounded-full uppercase tracking-wider border border-college-gold/30">
              OFFICIAL SIH REDIRECT
            </span>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-college-navy">
              Redirecting to Official SIH Portal...
            </h1>
            <p className="text-slate-600 text-xs md:text-sm">
              All official Smart India Hackathon problem statements are published exclusively on the government portal.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center gap-3">
            <a
              href={OFFICIAL_SIH_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-college-navy to-college-blue text-white px-7 py-3 rounded-xl font-bold text-xs shadow-lg hover:brightness-110 transition-all border border-college-gold/30"
            >
              <span>Click Here if Not Redirected Automatically</span>
              <ArrowRight className="w-4 h-4 text-college-gold" />
            </a>
            
            <span className="text-[11px] text-slate-400 font-mono">
              Destination: {OFFICIAL_SIH_PORTAL_URL}
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
