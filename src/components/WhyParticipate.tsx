import React from 'react';
import { 
  Lightbulb, 
  Code2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Building2, 
  Sparkles 
} from 'lucide-react';

export default function WhyParticipate() {
  const benefits = [
    {
      title: 'Real-World Problem Solving',
      desc: 'Build software and hardware prototypes for actual problems published by Ministries & Industry partners.',
      icon: Lightbulb,
    },
    {
      title: 'Technical Skill Advancement',
      desc: 'Master modern full-stack frameworks, AI models, IoT hardware, and cloud deployment pipelines.',
      icon: Code2,
    },
    {
      title: 'Interdisciplinary Teamwork',
      desc: 'Form cross-departmental teams combining engineering, domain logic, system architecture, and pitching.',
      icon: Users,
    },
    {
      title: 'Expert Institutional Mentorship',
      desc: 'Receive direct guidance from senior CRR faculty members and domain expert industry alumni.',
      icon: GraduationCap,
    },
    {
      title: 'Portfolio & Resume Boost',
      desc: 'Stand out in campus placements with a nationally recognized hackathon credential and live project.',
      icon: Briefcase,
    },
    {
      title: 'National Recognition & Cash Prizes',
      desc: 'Win prestigious cash awards up to ₹1,00,000 per problem statement at the Grand Finale.',
      icon: Trophy,
    },
    {
      title: 'Represent Sir C.R. Reddy College',
      desc: 'Bring honor and accolades to the institution at Nodal Centers across India.',
      icon: Building2,
    },
    {
      title: 'Startup & Incubation Opportunities',
      desc: 'Transform top hackathon projects into commercial startups backed by college innovation grants.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
            Student Growth & Impact
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy heading-accent-center mb-3">
            Why Participate in SIH?
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mt-4">
            Participating in the Smart India Hackathon is a transformative journey that equips engineering students with practical experience, national exposure, and career-defining skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="college-card p-5 border border-slate-200 hover:border-college-navy/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 text-college-navy flex items-center justify-center mb-3 group-hover:bg-college-navy group-hover:text-college-gold transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-college-navy mb-1.5 group-hover:text-college-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.desc}
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
