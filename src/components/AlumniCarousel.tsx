'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAlumni } from '@/lib/firestore';
import { Alumni } from '@/types';
import { Trophy, ChevronLeft, ChevronRight, ArrowRight, User } from 'lucide-react';

export default function AlumniCarousel() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getAlumni().then(data => setAlumniList(data));
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? Math.max(0, alumniList.length - 1) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= alumniList.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
              Hall of Fame
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy heading-accent">
              Our SIH Alumni
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded bg-slate-100 hover:bg-college-navy hover:text-white text-slate-700 flex items-center justify-center border border-slate-300 transition-colors"
                aria-label="Previous alumni"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded bg-slate-100 hover:bg-college-navy hover:text-white text-slate-700 flex items-center justify-center border border-slate-300 transition-colors"
                aria-label="Next alumni"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link
              href="/alumni"
              className="inline-flex items-center gap-1 text-xs font-bold text-college-navy hover:text-college-accent border border-college-border px-3.5 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              <span>VIEW ALL ALUMNI</span>
              <ArrowRight className="w-3.5 h-3.5 text-college-gold" />
            </Link>
          </div>
        </div>

        {/* Carousel / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {alumniList.slice(0, 4).map((item) => (
            <div 
              key={item.id}
              className="college-card p-5 flex flex-col justify-between border border-slate-200 hover:border-college-gold transition-all"
            >
              <div>
                <div className="relative mb-4">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded border border-slate-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-200 rounded flex items-center justify-center text-slate-400 border border-slate-300">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 bg-college-dark/90 text-college-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-college-gold/40">
                    SIH {item.sihYear}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-college-navy">
                    {item.name}
                  </h3>
                  <div className="text-[11px] font-medium text-slate-600">
                    {item.department} ({item.graduationYear})
                  </div>
                  <div className="text-[11px] text-college-accent font-semibold flex items-center gap-1">
                    <span>Team: {item.teamName}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded text-[10px] font-semibold">
                    <Trophy className="w-3 h-3 text-college-gold shrink-0" />
                    <span className="truncate">{item.achievement}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight italic">
                    "{item.problemStatement}"
                  </p>
                </div>
              </div>

              {item.company && (
                <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                  Current: {item.currentRole} @ {item.company}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-[11px] text-slate-500 italic">
          * Displaying sample alumni records. Official historical data will be continuously updated by the college admin.
        </div>

      </div>
    </section>
  );
}
