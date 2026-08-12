'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProblemStatements } from '@/lib/firestore';
import { ProblemStatement } from '@/types';
import { Search, Filter, Cpu, Code2, Building, ArrowRight, CheckCircle, FileText } from 'lucide-react';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Software' | 'Hardware'>('ALL');
  const [selectedPs, setSelectedPs] = useState<ProblemStatement | null>(null);

  useEffect(() => {
    getProblemStatements().then(data => setProblems(data));
  }, []);

  const filteredProblems = problems.filter(ps => {
    const matchesSearch =
      ps.psId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || ps.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <div className="bg-college-dark text-white py-12 border-b-4 border-college-gold">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-xs font-mono font-bold text-college-gold tracking-widest uppercase bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30">
              Smart India Hackathon 2026
            </span>
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white mt-3">
              Official Problem Statements Repository
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mt-2">
              Browse challenges submitted by Union Ministries, State Departments, and Industry Leaders.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search PS ID, title, ministry, or domain..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Category:</span>
              <div className="flex bg-slate-100 p-1 rounded border border-slate-300 text-xs font-semibold">
                {(['ALL', 'Software', 'Hardware'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded transition-colors ${
                      categoryFilter === cat
                        ? 'bg-college-navy text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProblems.map((ps) => (
              <div 
                key={ps.id}
                className="college-card p-6 border border-slate-200 hover:border-college-gold transition-all flex flex-col justify-between"
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

                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium mb-3">
                    <Building className="w-4 h-4 text-college-gold shrink-0" />
                    <span>{ps.organization}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded inline-block mb-3 border border-slate-200">
                    Domain: {ps.domain}
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    {ps.description}
                  </p>

                  {ps.keyRequirements && (
                    <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-college-navy uppercase">Key Deliverables</div>
                      <ul className="space-y-1 text-[11px] text-slate-600">
                        {ps.keyRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPs(ps)}
                    className="text-xs font-semibold text-slate-600 hover:text-college-navy flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Details
                  </button>

                  <Link
                    href={`/register?psId=${ps.psId}`}
                    className="inline-flex items-center gap-1.5 bg-college-navy hover:bg-college-blue text-white px-4 py-2 rounded text-xs font-bold transition-colors border border-college-gold/30"
                  >
                    <span>SELECT THIS PS</span>
                    <ArrowRight className="w-3.5 h-3.5 text-college-gold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Details Modal */}
          {selectedPs && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white max-w-2xl w-full rounded-lg border-2 border-college-gold p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold bg-college-dark text-college-gold px-2.5 py-0.5 rounded">
                      PS ID: {selectedPs.psId}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-college-navy mt-1">
                      {selectedPs.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedPs(null)}
                    className="text-slate-400 hover:text-slate-700 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div>
                    <strong className="text-college-navy">Organization:</strong> {selectedPs.organization}
                  </div>
                  <div>
                    <strong className="text-college-navy">Category:</strong> {selectedPs.category} | <strong className="text-college-navy">Domain:</strong> {selectedPs.domain}
                  </div>
                  <div>
                    <strong className="text-college-navy">Full Description:</strong>
                    <p className="text-slate-600 mt-1 leading-relaxed">{selectedPs.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedPs(null)}
                    className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-semibold text-xs"
                  >
                    Close
                  </button>
                  <Link
                    href={`/register?psId=${selectedPs.psId}`}
                    className="px-5 py-2 rounded bg-college-navy text-white font-bold text-xs hover:bg-college-blue"
                  >
                    Register Team for this PS →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
