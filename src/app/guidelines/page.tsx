'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ChevronDown, 
  ShieldCheck, 
  Users, 
  FileCheck, 
  Code, 
  Presentation, 
  Award, 
  Upload, 
  AlertTriangle 
} from 'lucide-react';

interface GuidelineItem {
  id: string;
  title: string;
  icon: any;
  content: string[];
}

export default function GuidelinesPage() {
  const [openSections, setOpenSections] = useState<string[]>(['eligibility', 'team-formation']);

  const guidelines: GuidelineItem[] = [
    {
      id: 'eligibility',
      title: '1. Student Eligibility Criteria',
      icon: ShieldCheck,
      content: [
        'All regular undergraduate (B.Tech) and postgraduate (M.Tech/MCA) students enrolled at Sir C.R. Reddy College of Engineering (Autonomous) are eligible.',
        'Students from any academic department (CSE, ECE, IT, EEE, Mechanical, Civil, AI&DS) can participate.',
        'No backlog criteria applies for internal screening, but active academic standing is required.',
      ],
    },
    {
      id: 'team-formation',
      title: '2. Team Formation & Size Guidelines',
      icon: Users,
      content: [
        'Each team MUST consist of exactly 6 members.',
        'Having at least 1 female team member is MANDATORY as per official SIH national guidelines.',
        'Interdisciplinary teams combining software, hardware, and domain expertise are strongly encouraged.',
        'One student can only belong to ONE team. Multi-team registrations will be disqualified.',
      ],
    },
    {
      id: 'registration-rules',
      title: '3. Registration Rules & Verification',
      icon: FileCheck,
      content: [
        'Team registration must be submitted exclusively via this official college portal.',
        'Upon submission, a unique Registration ID (SIH-2026-XXXX) will be generated. Save this ID.',
        'All member roll numbers and email addresses must match college records.',
        'Changes in team members after internal hackathon screening will require written approval from the SIH Convenor.',
      ],
    },
    {
      id: 'problem-rules',
      title: '4. Problem Statement Rules',
      icon: Code,
      content: [
        'Teams can choose problem statements from the official SIH 2026 portal (Software or Hardware categories).',
        'Each team can register for only 1 problem statement for the internal evaluation round.',
        'Teams building Student Innovation / Open Category prototypes must provide clear social/industrial utility.',
      ],
    },
    {
      id: 'dev-guidelines',
      title: '5. Development & Prototyping Guidelines',
      icon: Code,
      content: [
        'All software solutions must use open-source technology frameworks and clean codebase practices.',
        'Hardware teams must demonstrate physical circuit prototypes, microcontrollers (Arduino/Raspberry Pi/ESP32), or CAD models.',
        'Plagiarism or copy-pasting existing open-source repositories without original contribution will lead to immediate rejection.',
      ],
    },
    {
      id: 'presentation-reqs',
      title: '6. Presentation & Pitching Requirements',
      icon: Presentation,
      content: [
        'Teams shortlisted for campus evaluation must prepare an 8-slide presentation according to the official SIH template.',
        'Slides must cover: Problem Statement, Solution Architecture, Tech Stack, Feasibility, Impact, and Demo Video/Prototype.',
        'Pitch duration: 7 minutes presentation + 3 minutes Q&A by jury members.',
      ],
    },
    {
      id: 'evaluation-criteria',
      title: '7. Evaluation Criteria',
      icon: Award,
      content: [
        'Innovation & Originality: 25%',
        'Technical Feasibility & Architecture: 25%',
        'Completeness of Working Prototype: 25%',
        'Impact & User Experience: 15%',
        'Presentation & Team Q&A Handling: 10%',
      ],
    },
    {
      id: 'submission-reqs',
      title: '8. Submission Requirements',
      icon: Upload,
      content: [
        'Final code repositories must be hosted on public GitHub/GitLab with a comprehensive README.md.',
        'Working demo video (2-3 minutes) uploaded to YouTube/Drive must be included in the presentation.',
        'Abstract document PDF must be submitted to the internal evaluation portal before the deadline.',
      ],
    },
    {
      id: 'important-instructions',
      title: '9. Important Institutional Instructions',
      icon: AlertTriangle,
      content: [
        'Strict discipline and academic integrity must be maintained during hackathon proceedings.',
        'Top nominated teams will receive college financial support and lab facilities for the Grand Finale.',
        'The decision of the Sir C.R. Reddy CoE SIH Jury & Convenor Committee will be final and binding.',
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <div className="bg-college-dark text-white py-12 border-b-4 border-college-gold">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
            <span className="text-xs font-mono font-bold text-college-gold tracking-widest uppercase bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30">
              Official Institutional Manual
            </span>
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white mt-3">
              SIH 2026 Hackathon Guidelines
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded border border-amber-400/40">
                📅 Event Dates: 15th & 16th September 2026
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-400/40">
                🏆 Total Prize Pool: ₹44,000
              </span>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
          {guidelines.map((item) => {
            const isOpen = openSections.includes(item.id);
            const Icon = item.icon;

            return (
              <div 
                key={item.id}
                className="bg-white rounded border border-slate-300 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 font-serif font-bold text-sm md:text-base text-college-navy">
                    <Icon className="w-5 h-5 text-college-gold shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 py-4 bg-white border-t border-slate-200">
                    <ul className="space-y-2 text-xs text-slate-700">
                      {item.content.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-college-gold font-bold text-sm">px</span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
