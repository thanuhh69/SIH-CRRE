import React from 'react';
import { JOURNEY_STATS } from '@/data/placeholder';
import { Trophy, Award, BookOpen, Sparkles } from 'lucide-react';

export default function JourneySection() {
  return (
    <section id="journey" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-bold text-college-gold uppercase tracking-widest">
              Legacy of Innovation
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy heading-accent">
              Our SIH Journey
            </h2>

            <p className="text-slate-700 text-sm leading-relaxed pt-2">
              Sir C.R. Reddy College of Engineering (Autonomous) has a rich heritage of participating in Smart India Hackathons. Our students have consistently demonstrated technical excellence, problem-solving acumen, and teamwork under the guidance of our experienced faculty mentors.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <Trophy className="w-5 h-5 text-college-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs text-college-navy">National Level Achievements</h4>
                  <p className="text-slate-600 text-[11px]">Multiple student teams representing CRR have secured top positions at SIH Grand Finales across various Nodal Centers nationwide.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <BookOpen className="w-5 h-5 text-college-navy shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs text-college-navy">Institutional Mentorship Cell</h4>
                  <p className="text-slate-600 text-[11px]">Dedicated faculty advisers provide technical support, hardware prototyping labs, and presentation coaching throughout the hackathon lifecycle.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stats Block Column (Strictly Placeholder Numbers per specs) */}
          <div className="lg:col-span-5">
            <div className="bg-college-dark text-white p-6 md:p-8 rounded-lg shadow-college-lg border-2 border-college-gold/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-college-gold/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h3 className="font-serif font-bold text-lg text-college-goldLight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-college-gold" /> Participation Metrics
                </h3>
                <span className="text-[10px] font-mono bg-college-gold/20 text-college-gold px-2 py-0.5 rounded border border-college-gold/30">
                  HISTORICAL DATA
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {JOURNEY_STATS.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/5 border border-white/10 p-4 rounded text-center hover:bg-white/10 transition-transform transform hover:-translate-y-1"
                  >
                    <div className="font-serif font-black text-2xl md:text-3xl text-college-gold tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-[11px] font-medium text-slate-300 mt-1 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] text-slate-400">
                Official statistics will be updated dynamically after SIH 2026 internal evaluations.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
