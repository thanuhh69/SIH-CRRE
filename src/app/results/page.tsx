'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { subscribeResults, subscribeResultsConfig } from '@/lib/firestore';
import { ResultItem, ResultsConfig } from '@/types';
import { 
  Trophy, 
  Award, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  Sparkles, 
  Users, 
  Building, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Star,
  ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PublicResultsPage() {
  const [config, setConfig] = useState<ResultsConfig>({ published: false });
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'rank_asc' | 'rank_desc' | 'score_desc'>('rank_asc');

  useEffect(() => {
    const unsubConfig = subscribeResultsConfig((cfg) => {
      setConfig(cfg);
      setLoading(false);
    });

    const unsubResults = subscribeResults((list) => {
      setResults(list);
    });

    return () => {
      unsubConfig();
      unsubResults();
    };
  }, []);

  // Filter & sort results
  const filteredResults = results.filter((res) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      res.teamId.toLowerCase().includes(term) ||
      res.teamName.toLowerCase().includes(term) ||
      res.problemStatement.toLowerCase().includes(term) ||
      (res.problemStatementId && res.problemStatementId.toLowerCase().includes(term)) ||
      res.members.some(m => m.name.toLowerCase().includes(term) || m.rollNumber.toLowerCase().includes(term));

    const matchesBranch = branchFilter === 'ALL' || res.branch === branchFilter;
    const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;

    return matchesSearch && matchesBranch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'rank_asc') return a.rank - b.rank;
    if (sortBy === 'rank_desc') return b.rank - a.rank;
    if (sortBy === 'score_desc') return b.score - a.score;
    return a.rank - b.rank;
  });

  const top3 = results
    .filter(r => r.rank >= 1 && r.rank <= 3)
    .sort((a, b) => a.rank - b.rank);

  // Generate PDF report
  const downloadResultsPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // College Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 297, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SIR C. R. REDDY COLLEGE OF ENGINEERING (AUTONOMOUS)', 14, 12);
    doc.setFontSize(11);
    doc.setTextColor(234, 179, 8); // Gold
    doc.text('SIH INTERNAL HACKATHON 2026 – OFFICIAL FINAL RESULTS REPORT', 14, 20);

    // Published date & timestamp
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const pubDate = config.publishedAt ? new Date(config.publishedAt).toLocaleString() : new Date().toLocaleString();
    doc.text(`Results Published On: ${pubDate} | Total Teams Evaluated: ${results.length}`, 14, 35);

    // Top 3 Winners Summary Table
    const winnersData = top3.map(w => [
      `Rank ${w.rank}`,
      w.teamId,
      w.teamName,
      w.branch,
      w.problemStatement,
      `${w.score} / 100`,
      w.status
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Rank', 'Team ID', 'Team Name', 'Department / Branch', 'Problem Statement', 'Score', 'Status']],
      body: winnersData,
      theme: 'grid',
      headStyles: { fillStyle: 'F', fillColor: [197, 155, 39], textColor: [15, 23, 42], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // Complete Results Table
    const finalY = (doc as any).lastAutoTable.finalY || 80;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('COMPLETE HACKATHON STANDINGS & EVALUATION RESULTS', 14, finalY + 10);

    const allResultsData = filteredResults.map(r => [
      r.rank,
      r.teamId,
      r.teamName,
      r.branch,
      r.problemStatement,
      r.score,
      r.status,
      r.members.map(m => m.name).join(', ')
    ]);

    autoTable(doc, {
      startY: finalY + 14,
      head: [['Rank', 'Team ID', 'Team Name', 'Department', 'Problem Statement', 'Score', 'Status', 'Team Members']],
      body: allResultsData,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });

    // Footer signature
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Sir C.R. Reddy College of Engineering · SIH 2026 Internal Hackathon Organizing Committee', 14, 200);
      doc.text(`Page ${i} of ${pageCount}`, 270, 200);
    }

    doc.save(`SIH_2026_Internal_Hackathon_Results_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const uniqueBranches = Array.from(new Set(results.map(r => r.branch).filter(Boolean)));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* State 1: Loading */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-college-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 text-sm font-semibold">Loading Hackathon Results...</p>
          </div>
        ) : !config.published ? (
          /* State 2: Results NOT Announced Yet */
          <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-slate-900 text-college-gold flex items-center justify-center mx-auto border-4 border-college-gold shadow-2xl animate-bounce">
              <Trophy className="w-12 h-12" />
            </div>

            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold font-mono">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>EVALUATION IN PROGRESS</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-college-navy tracking-tight">
              🏆 RESULTS NOT ANNOUNCED YET
            </h1>

            <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-md max-w-2xl mx-auto space-y-4">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                The official results of the <strong>SIH Internal Hackathon 2026</strong> will be published by the organizing committee after completion of the evaluation and screening process.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 text-left space-y-2">
                <div className="font-bold text-college-navy flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-college-gold" /> Official Announcement Guidelines:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Results will be updated in real-time on this page once finalized by judges.</li>
                  <li>Top teams will be nominated for the Smart India Hackathon 2026 Grand Finale.</li>
                  <li>Check back soon or consult your departmental SIH coordinators for updates.</li>
                </ul>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Sir C. R. Reddy College of Engineering (Autonomous) · Eluru, AP
            </div>
          </div>
        ) : (
          /* State 3: Results Published */
          <div className="space-y-12 pb-16">
            {/* Hero Header */}
            <section className="bg-gradient-to-r from-college-dark via-slate-900 to-college-navy text-white py-12 px-4 border-b-4 border-college-gold shadow-lg">
              <div className="max-w-7xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-college-gold/20 text-college-goldLight px-3.5 py-1 rounded-full text-xs font-mono font-bold border border-college-gold/40">
                  <Sparkles className="w-4 h-4 text-college-gold" />
                  <span>OFFICIAL ANNOUNCEMENT</span>
                </div>

                <h1 className="font-serif font-bold text-3xl sm:text-5xl tracking-tight">
                  🏆 HACKATHON RESULTS
                </h1>
                <h2 className="text-college-gold font-serif font-bold text-lg sm:text-xl">
                  Celebrating Innovation, Creativity & Problem Solving
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
                  Sir C. R. Reddy College of Engineering · SIH 2026 Internal Campus Selection
                </p>

                {config.publishedAt && (
                  <div className="inline-block bg-white/10 text-slate-200 px-4 py-1.5 rounded-full text-xs font-mono border border-white/20">
                    <strong>Results Published On:</strong> {new Date(config.publishedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                  </div>
                )}
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 space-y-12">
              
              {/* TOP 3 WINNERS SECTION */}
              {top3.length > 0 && (
                <section className="space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-college-navy flex items-center justify-center gap-2">
                      <Trophy className="w-7 h-7 text-college-gold" /> Top 3 Hackathon Champions
                    </h2>
                    <p className="text-xs text-slate-600">Leading Teams Nominated for SIH 2026 National Competition</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {top3.map((winner) => {
                      const isRank1 = winner.rank === 1;
                      const isRank2 = winner.rank === 2;
                      const isRank3 = winner.rank === 3;

                      return (
                        <div
                          key={winner.id}
                          className={`relative bg-white rounded-xl border-2 overflow-hidden shadow-lg flex flex-col justify-between transition-all duration-300 ${
                            isRank1
                              ? 'border-college-gold shadow-2xl md:-translate-y-3 bg-gradient-to-b from-amber-50/60 via-white to-white'
                              : isRank2
                              ? 'border-slate-400'
                              : 'border-amber-700/60'
                          }`}
                        >
                          {/* Rank Badge Header */}
                          <div className={`p-4 text-center font-bold text-white flex items-center justify-center gap-2 ${
                            isRank1 ? 'bg-gradient-to-r from-amber-600 via-college-gold to-amber-600' :
                            isRank2 ? 'bg-slate-700' :
                            'bg-amber-900'
                          }`}>
                            <span className="text-2xl">
                              {isRank1 ? '🥇' : isRank2 ? '🥈' : '🥉'}
                            </span>
                            <span className="font-serif text-lg tracking-wider">
                              {isRank1 ? 'RANK 1 WINNER' : isRank2 ? 'RANK 2 RUNNER-UP' : 'RANK 3 FINALIST'}
                            </span>
                          </div>

                          {/* Card Content */}
                          <div className="p-6 space-y-4 flex-grow">
                            <div>
                              <div className="text-[11px] font-mono text-college-gold font-bold">{winner.teamId}</div>
                              <h3 className="font-serif font-bold text-xl text-college-navy mt-0.5">{winner.teamName}</h3>
                              <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-slate-300 mt-1">
                                {winner.branch}
                              </span>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Problem Statement</span>
                              <p className="font-semibold text-college-navy line-clamp-2">{winner.problemStatement}</p>
                              {winner.problemStatementId && (
                                <span className="text-[11px] font-mono text-college-gold font-bold">PS Code: {winner.problemStatementId}</span>
                              )}
                            </div>

                            <div className="flex justify-between items-center bg-college-navy/5 p-3 rounded border border-college-navy/10">
                              <span className="text-xs font-bold text-slate-600">Final Score:</span>
                              <span className="font-serif font-bold text-xl text-college-navy">{winner.score} / 100</span>
                            </div>

                            {/* Team Members List */}
                            <div className="space-y-1.5 pt-2 border-t border-slate-200">
                              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-college-gold" /> Team Members:
                              </span>
                              <ul className="text-xs space-y-1 text-slate-700">
                                {winner.members.map((m, idx) => (
                                  <li key={idx} className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                                    <span className="font-medium">{m.name} {m.isLeader && <span className="text-[10px] bg-college-gold text-college-dark font-bold px-1.5 rounded ml-1">LEADER</span>}</span>
                                    <span className="font-mono text-[10px] text-slate-500">{m.rollNumber || m.department}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {winner.remarks && (
                              <p className="text-[11px] italic text-slate-500 bg-amber-50/50 p-2 rounded border border-amber-200">
                                "{winner.remarks}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* COMPLETE RESULTS TABLE SECTION */}
              <section className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-college-navy flex items-center gap-2">
                      <Award className="w-6 h-6 text-college-gold" /> ALL HACKATHON RESULTS
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">Complete standings of all evaluated teams</p>
                  </div>

                  <button
                    onClick={downloadResultsPDF}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-college-navy hover:bg-college-blue text-white px-5 py-2.5 rounded font-bold text-xs shadow transition-colors border border-college-gold/30"
                  >
                    <Download className="w-4 h-4 text-college-gold" />
                    <span>📥 DOWNLOAD RESULTS PDF</span>
                  </button>
                </div>

                {/* Search & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search Team Name, ID, Member..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded outline-none bg-white"
                    />
                  </div>

                  <div>
                    <select
                      value={branchFilter}
                      onChange={e => setBranchFilter(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-medium"
                    >
                      <option value="ALL">All Departments / Branches</option>
                      {uniqueBranches.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-medium"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Winner">Winner</option>
                      <option value="Runner-up">Runner-up</option>
                      <option value="Finalist">Finalist</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Not Qualified">Not Qualified</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-bold text-college-navy"
                    >
                      <option value="rank_asc">Sort: Rank (Lowest First)</option>
                      <option value="rank_desc">Sort: Rank (Highest First)</option>
                      <option value="score_desc">Sort: Score (Highest First)</option>
                    </select>
                  </div>
                </div>

                {/* Results Table (Desktop) */}
                <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 font-serif font-bold text-college-navy border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-center">Rank</th>
                        <th className="p-3">Team ID</th>
                        <th className="p-3">Team Name</th>
                        <th className="p-3">Problem Statement</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3 text-right">Score</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredResults.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            No teams match your search or filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredResults.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-center font-bold text-sm">
                              <span className={`inline-block w-7 h-7 rounded-full text-white text-xs font-bold leading-7 text-center ${
                                res.rank === 1 ? 'bg-amber-500' :
                                res.rank === 2 ? 'bg-slate-600' :
                                res.rank === 3 ? 'bg-amber-800' : 'bg-slate-800'
                              }`}>
                                {res.rank}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-college-gold">{res.teamId}</td>
                            <td className="p-3 font-bold text-college-navy">{res.teamName}</td>
                            <td className="p-3 text-slate-700 max-w-xs truncate">{res.problemStatement}</td>
                            <td className="p-3 text-slate-600">{res.branch}</td>
                            <td className="p-3 text-right font-bold text-sm text-college-navy">{res.score}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                                res.status === 'Winner' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                res.status === 'Runner-up' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                res.status === 'Finalist' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                res.status === 'Qualified' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                                'bg-slate-100 text-slate-700 border border-slate-300'
                              }`}>
                                {res.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Cards */}
                <div className="md:hidden space-y-3">
                  {filteredResults.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 bg-slate-50 rounded border">
                      No results match your search.
                    </div>
                  ) : (
                    filteredResults.map((res) => (
                      <div key={res.id} className="p-4 bg-white border border-slate-300 rounded-lg space-y-2 shadow-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-college-gold font-bold">{res.teamId}</span>
                            <h4 className="font-bold text-sm text-college-navy">{res.teamName}</h4>
                          </div>
                          <span className="font-serif font-bold text-base bg-college-navy text-white px-2.5 py-0.5 rounded">
                            #{res.rank}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">{res.problemStatement}</p>

                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                          <span className="text-slate-500 font-medium">{res.branch}</span>
                          <span className="font-bold text-college-navy">Score: {res.score}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
