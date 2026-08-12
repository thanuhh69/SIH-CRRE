import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import JourneySection from '@/components/JourneySection';
import { ShieldCheck, Award, Users, BookOpen } from 'lucide-react';
import { HERO_DATA } from '@/data/placeholder';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Institutional Header Banner */}
        <div className="bg-college-dark text-white py-12 border-b-4 border-college-gold">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-xs font-mono font-bold text-college-gold tracking-widest uppercase bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30">
              Institutional Context & Vision
            </span>
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white mt-3">
              About SIH 2026 at Sir C.R. Reddy CoE
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mt-2">
              Empowering students to engineer real-world technical solutions for India's national challenges.
            </p>
          </div>
        </div>

        <AboutSection />
        
        {/* Committee & Leadership Section */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
                College Governance
              </div>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-college-navy heading-accent-center mb-3">
                SIH Internal Steering Committee
              </h2>
              <p className="text-slate-600 text-xs leading-relaxed mt-4">
                Under the visionary guidance of college management, principal office, and departmental HODs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="college-card p-6 text-center border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-college-navy text-college-gold flex items-center justify-center mx-auto mb-3 border-2 border-college-gold">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-base text-college-navy">Patron & Leadership</h3>
                <p className="text-xs font-semibold text-college-gold mt-0.5">Principal Office</p>
                <p className="text-[11px] text-slate-500 mt-2">Overseeing institutional facilities, grant approvals, and national finale delegation logistics.</p>
              </div>

              <div className="college-card p-6 text-center border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-college-navy text-college-gold flex items-center justify-center mx-auto mb-3 border-2 border-college-gold">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-base text-college-navy">SIH Convenor & Coordinators</h3>
                <p className="text-xs font-semibold text-college-gold mt-0.5">Innovation Cell</p>
                <p className="text-[11px] text-slate-500 mt-2">Managing student registration, team verification, internal evaluation, and portal submissions.</p>
              </div>

              <div className="college-card p-6 text-center border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-college-navy text-college-gold flex items-center justify-center mx-auto mb-3 border-2 border-college-gold">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-base text-college-navy">Departmental Mentors</h3>
                <p className="text-xs font-semibold text-college-gold mt-0.5">CSE, ECE, IT, EEE, Mech, Civil</p>
                <p className="text-[11px] text-slate-500 mt-2">Guiding technical domain selection, code reviews, and hardware prototyping validation.</p>
              </div>
            </div>
          </div>
        </section>

        <JourneySection />
      </main>

      <Footer />
    </div>
  );
}
