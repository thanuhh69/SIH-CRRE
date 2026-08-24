'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAlumni, subscribeAlumni } from '@/lib/firestore';
import { Alumni } from '@/types';
import { Trophy, Search, User, Filter, Award, Sparkles } from 'lucide-react';

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    getAlumni().then(data => setAlumniList(data));
    const unsubscribe = subscribeAlumni(data => setAlumniList(data));
    return () => unsubscribe();
  }, []);

  const departments = ['ALL', ...Array.from(new Set(alumniList.map(a => a.department)))];

  const filteredAlumni = alumniList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === 'ALL' || item.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <div className="bg-college-dark text-white py-12 border-b-4 border-college-gold">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-3">
            <img 
              src="https://www.sih.gov.in/img/sih2022-logo.png" 
              alt="Smart India Hackathon Official Logo" 
              className="h-14 sm:h-16 w-auto bg-white p-2 rounded-lg border border-amber-300 shadow-md object-contain" 
            />
            <span className="text-xs font-mono font-bold text-college-gold tracking-widest uppercase bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30">
              Sir C.R. Reddy College of Engineering
            </span>
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white">
              SIH Alumni Hall of Fame
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mt-2">
              Celebrating our past SIH winners, grand finale participants, and student innovators.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search alumni by name, team, or problem..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-college-navy shrink-0" />
              <span className="text-xs font-bold text-slate-700 shrink-0">Department:</span>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded bg-white font-medium text-slate-900 outline-none w-full md:w-auto"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((item) => (
              <div 
                key={item.id}
                className="college-card p-6 border border-slate-200 hover:border-college-gold transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-college-gold shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-college-gold flex items-center justify-center text-slate-500 shrink-0">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-college-dark text-college-gold px-2 py-0.5 rounded border border-college-gold/30">
                        SIH {item.sihYear}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-college-navy mt-1">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600">
                        {item.department} ({item.graduationYear})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded font-semibold text-[11px] w-full">
                      <Trophy className="w-3.5 h-3.5 text-college-gold shrink-0" />
                      <span className="truncate">{item.achievement}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <div className="text-[10px] font-bold text-college-navy uppercase">Team: {item.teamName}</div>
                      <div className="font-semibold text-slate-800 text-[11px] mt-0.5">{item.problemStatement}</div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>

                {item.company && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between font-mono">
                    <span>Role: {item.currentRole}</span>
                    <span className="font-bold text-college-navy">@{item.company}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAlumni.length === 0 && (
            <div className="text-center py-16 bg-white rounded border border-slate-200 text-slate-500 text-xs">
              No alumni records match your search query.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
