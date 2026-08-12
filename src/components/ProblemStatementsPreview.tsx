'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProblemStatements } from '@/lib/firestore';
import { ProblemStatement } from '@/types';
import { ArrowRight, Building, Tag, Cpu, Code2 } from 'lucide-react';

export default function ProblemStatementsPreview() {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);

  useEffect(() => {
    getProblemStatements().then(data => setProblems(data.slice(0, 4)));
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
              Official SIH Challenges
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy heading-accent">
              Problem Statements Preview
            </h2>
          </div>

          <Link
            href="/problems"
            className="inline-flex items-center gap-2 bg-college-navy hover:bg-college-blue text-white px-5 py-2.5 rounded text-xs font-bold tracking-wider shadow-sm transition-colors border border-college-gold/30"
          >
            <span>VIEW ALL PROBLEM STATEMENTS</span>
            <ArrowRight className="w-4 h-4 text-college-gold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((ps) => (
            <div 
              key={ps.id}
              className="college-card p-6 border border-slate-200 hover:border-college-gold/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold bg-college-dark text-college-gold px-2.5 py-1 rounded border border-college-gold/30">
                    PS ID: {ps.psId}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    ps.category === 'Hardware' 
                      ? 'bg-purple-50 text-purple-800 border-purple-200' 
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {ps.category === 'Hardware' ? <Cpu className="w-3 h-3 inline mr-1" /> : <Code2 className="w-3 h-3 inline mr-1" />}
                    {ps.category}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-college-navy mb-2 leading-snug">
                  {ps.title}
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-3">
                  <Building className="w-3.5 h-3.5 text-college-gold shrink-0" />
                  <span className="font-medium text-slate-800">{ps.organization}</span>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded inline-block mb-3 border border-slate-200">
                  Domain: {ps.domain}
                </div>

                <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                  {ps.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-college-accent">
                  SIH 2026 Challenge
                </span>
                <Link
                  href={`/problems?select=${ps.psId}`}
                  className="text-xs font-bold text-college-navy hover:text-college-gold transition-colors flex items-center gap-1"
                >
                  <span>Select & Register →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
