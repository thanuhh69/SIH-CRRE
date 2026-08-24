'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  Cpu, 
  Users, 
  Rocket, 
  HeartHandshake, 
  ShieldCheck 
} from 'lucide-react';

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
      desc: 'Fostering interdisciplinary collaboration across CSE, ECE, IT, EEE, AI&DS, AI&ML, Cyber Security, Civil, and Mechanical departments.',
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
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
            Sir C.R. Reddy College of Engineering (Autonomous)
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy mb-4 heading-accent-center">
            About Smart India Hackathon
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mt-4">
            Smart India Hackathon (SIH) is a nationwide initiative by the Ministry of Education's Innovation Cell to provide students with a platform to solve pressing problems of government ministries, departments, industries, and other organizations.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="college-card p-6 border border-slate-200 hover:border-college-gold transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-college-navy group-hover:bg-college-navy group-hover:text-college-gold transition-colors mb-4 shadow-xs">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-college-navy mb-2 group-hover:text-college-accent transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* College Accreditation Banner */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-college-navy text-college-gold rounded-full shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-college-navy">Institutional Excellence & Incubation Support</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Sir C.R. Reddy College of Engineering provides full mentorship, lab facilities, software licenses, and hardware component support for all internal hackathon teams.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
