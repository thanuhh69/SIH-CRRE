import React from 'react';
import { 
  UserPlus, 
  FileSearch, 
  Code, 
  Layers, 
  ClipboardCheck, 
  CheckCircle2, 
  Award 
} from 'lucide-react';

export default function Timeline() {
  const steps = [
    { num: '01', title: 'Team Registration', desc: 'Form team of 6 students (min 1 female member) & register.', icon: UserPlus },
    { num: '02', title: 'Problem Selection', desc: 'Browse official SIH 2026 problem statements & select challenge.', icon: FileSearch },
    { num: '03', title: 'Idea Development', desc: 'Draft architecture, tech stack choice, & prototype design.', icon: Code },
    { num: '04', title: 'Internal Hackathon', desc: 'Participate in campus hackathon round at Sir C.R. Reddy CoE.', icon: Layers },
    { num: '05', title: 'Evaluation', desc: 'Present working prototype & pitch to jury of experts.', icon: ClipboardCheck },
    { num: '06', title: 'Results', desc: 'Announcement of winning campus teams on notice board.', icon: CheckCircle2 },
    { num: '07', title: 'SIH Nomination', desc: 'Nominated teams uploaded to Ministry portal for Finale.', icon: Award },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
            Roadmap to National Finale
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy heading-accent-center mb-3">
            Hackathon Process Timeline
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mt-4">
            Follow the 7-step institutional workflow from campus team registration to final nomination on the official Smart India Hackathon portal.
          </p>
        </div>

        {/* Desktop Process Roadmap Grid */}
        <div className="hidden lg:grid grid-cols-7 gap-3 relative">
          {/* Connector Line behind steps */}
          <div className="absolute top-10 left-8 right-8 h-1 bg-college-border -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-white border-2 border-college-navy text-college-navy flex items-center justify-center shadow-md group-hover:bg-college-navy group-hover:text-college-gold group-hover:scale-105 transition-all mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold font-mono text-college-gold uppercase bg-college-dark px-2 py-0.5 rounded mb-1">
                  Step {step.num}
                </span>
                <h3 className="font-serif font-bold text-xs text-college-navy mb-1 leading-tight group-hover:text-college-accent">
                  {step.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-4 relative border-l-2 border-college-navy/40 ml-4 pl-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group">
                <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-college-navy text-college-gold flex items-center justify-center text-xs font-bold border border-college-gold">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="college-card p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold font-mono text-college-gold uppercase bg-college-dark px-1.5 py-0.5 rounded">
                      Step {step.num}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-college-navy">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
