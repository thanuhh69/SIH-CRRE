import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegistrationForm from '@/components/RegistrationForm';
import { Calendar, Trophy, ExternalLink, Sparkles, Code2, Cpu } from 'lucide-react';
import { OFFICIAL_SIH_PORTAL_URL, PRIZE_DATA } from '@/data/placeholder';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow py-8">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          
          {/* Official Registration Page Header & Information Banner */}
          <div className="bg-gradient-to-r from-college-dark via-college-navy to-college-dark text-white rounded-2xl p-6 md:p-8 border-b-4 border-college-gold shadow-2xl space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-college-gold tracking-widest uppercase bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30">
                  SIH Internal Hackathon 2026
                </span>
                <h1 className="font-serif font-extrabold text-2xl sm:text-3xl md:text-4xl text-white mt-2">
                  Official Team Registration
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">
                  Sir C.R. Reddy College of Engineering (Autonomous), Eluru, Andhra Pradesh
                </p>
              </div>

              {/* Event Dates Highlight Badge */}
              <div className="bg-amber-500/20 border-2 border-college-gold p-4 rounded-xl text-center shrink-0 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-college-gold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-college-gold" />
                  <span>EVENT DATES</span>
                </div>
                <div className="font-serif font-extrabold text-lg text-white">
                  15th & 16th September 2026
                </div>
              </div>
            </div>

            {/* Prize Money Breakdown Card Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-college-gold font-mono uppercase tracking-wider">
                  <Trophy className="w-4 h-4" /> 🏆 PRIZE MONEY BREAKDOWN
                </div>
                <span className="text-xs font-bold text-college-goldLight bg-college-gold/20 px-3 py-1 rounded-full border border-college-gold/40">
                  Total Prize Pool: {PRIZE_DATA.totalPool}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Software Category Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-xs font-serif font-bold text-blue-300 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4" /> Software Category</span>
                    <span className="font-mono text-[11px] text-slate-300">₹22,000 Total</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white/5 rounded border border-white/10">
                      <div className="text-base">🥇 1st</div>
                      <div className="font-mono font-bold text-college-gold mt-0.5">₹10,000</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded border border-white/10">
                      <div className="text-base">🥈 2nd</div>
                      <div className="font-mono font-bold text-slate-200 mt-0.5">₹7,000</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded border border-white/10">
                      <div className="text-base">🥉 3rd</div>
                      <div className="font-mono font-bold text-amber-300 mt-0.5">₹5,000</div>
                    </div>
                  </div>
                </div>

                {/* Hardware Category Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-xs font-serif font-bold text-purple-300 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4" /> Hardware Category</span>
                    <span className="font-mono text-[11px] text-slate-300">₹22,000 Total</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white/5 rounded border border-white/10">
                      <div className="text-base">🥇 1st</div>
                      <div className="font-mono font-bold text-college-gold mt-0.5">₹10,000</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded border border-white/10">
                      <div className="text-base">🥈 2nd</div>
                      <div className="font-mono font-bold text-slate-200 mt-0.5">₹7,000</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded border border-white/10">
                      <div className="text-base">🥉 3rd</div>
                      <div className="font-mono font-bold text-amber-300 mt-0.5">₹5,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent Official SIH Problem Statements Redirect Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="text-xs text-slate-200">
                Need to view problem statements before submitting? Check the official portal:
              </div>
              <a
                href={OFFICIAL_SIH_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-college-gold via-amber-500 to-college-gold text-college-dark font-extrabold px-6 py-2.5 rounded-lg text-xs shadow-md hover:brightness-110 transition-all border border-amber-300"
              >
                <span>View Official SIH Problem Statements</span>
                <ExternalLink className="w-4 h-4 text-college-dark" />
              </a>
            </div>

          </div>

          <RegistrationForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
