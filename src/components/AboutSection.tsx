import React from 'react';
import { Lightbulb, Target, Cpu, Users, Rocket, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function AboutSection() {
  const pillars = [
    {
      title: 'Innovation',
      desc: 'Encouraging students to think outside traditional academic boundaries and build breakthrough solutions.',
      icon: Lightbulb,
    },
    {
      title: 'Problem Solving',
      desc: 'Tackling authentic challenges posted by Union Ministries, State Governments, and leading Public Enterprises.',
      icon: Target,
    },
    {
      title: 'Technology',
      desc: 'Leveraging cutting-edge stacks—Artificial Intelligence, IoT, Blockchain, Cloud, and Embedded Hardware.',
      icon: Cpu,
    },
    {
      title: 'Teamwork',
      desc: 'Fostering interdisciplinary collaboration across CSE, ECE, IT, EEE, Civil, and Mechanical departments.',
      icon: Users,
    },
    {
      title: 'Entrepreneurship',
      desc: 'Nurturing student hackathon prototypes into viable campus startups and intellectual properties.',
      icon: Rocket,
    },
    {
      title: 'Social Impact',
      desc: 'Solving ground-level issues in agriculture, healthcare, water safety, clean energy, and e-governance.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
            Sir C.R. Reddy College of Engineering (Autonomous)
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy mb-4 heading-accent-center">
            About Smart India Hackathon
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mt-4">
            Smart India Hackathon (SIH) is a nationwide initiative by the Ministry of Education's Innovation Cell to provide students with a platform to solve pressing problems of government ministries, departments, industries, and other organizations.
          </p>
        </div>

        {/* Institutional Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.title}
                className="college-card p-6 border border-slate-200 hover:border-college-gold/60 transition-all group"
              >
                <div className="w-12 h-12 rounded bg-college-light border border-college-border text-college-navy flex items-center justify-center mb-4 group-hover:bg-college-navy group-hover:text-college-gold transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-college-navy mb-2 group-hover:text-college-accent transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* College Commitment Box */}
        <div className="mt-12 bg-college-light border-l-4 border-college-navy p-6 rounded-r shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-college-navy shrink-0 mt-1" />
            <div>
              <h4 className="font-serif font-bold text-college-navy text-base">
                Internal Selection & College Nomination
              </h4>
              <p className="text-slate-600 text-xs mt-1">
                The Internal Hackathon at Sir C.R. Reddy College of Engineering serves as the official screening round to evaluate, mentor, and nominate the top teams for the SIH 2026 National Grand Finale.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
