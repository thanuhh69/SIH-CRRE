'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getAlumni, subscribeAlumni } from '@/lib/firestore';
import { Alumni } from '@/types';
import { Trophy, ChevronLeft, ChevronRight, ArrowRight, User, Sparkles } from 'lucide-react';

export default function AlumniCarousel() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAlumni().then(data => setAlumniList(data));
    const unsubscribe = subscribeAlumni(data => setAlumniList(data));
    return () => unsubscribe();
  }, []);

  const totalItems = alumniList.length;

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.clientWidth;
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    if (totalItems === 0) return;
    const newIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    scrollToSlide(newIndex);
  };

  const handleNext = () => {
    if (totalItems === 0) return;
    const newIndex = currentIndex >= totalItems - 1 ? 0 : currentIndex + 1;
    scrollToSlide(newIndex);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.clientWidth;
      if (cardWidth > 0) {
        const newIndex = Math.round(container.scrollLeft / cardWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalItems) {
          setCurrentIndex(newIndex);
        }
      }
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-college-gold" /> Hall of Fame
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy heading-accent">
              Our SIH Alumni
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Slide Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-college-navy hover:text-white text-college-navy flex items-center justify-center border border-slate-300 transition-colors shadow-xs"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-college-navy hover:text-white text-college-navy flex items-center justify-center border border-slate-300 transition-colors shadow-xs"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/alumni"
              className="inline-flex items-center gap-1 text-xs font-bold text-college-navy hover:text-college-accent border border-college-border px-3.5 py-2.5 rounded hover:bg-slate-50 transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 text-college-gold" />
            </Link>
          </div>
        </div>

        {/* Slideshow Container (Horizontal Touch/Swipe Carousel on Mobile & Desktop) */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {alumniList.map((item, idx) => (
              <div
                key={item.id}
                className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <div className="college-card p-5 h-full flex flex-col justify-between border border-slate-200 hover:border-college-gold transition-all shadow-sm">
                  <div>
                    <div className="relative mb-4 overflow-hidden rounded-lg border-2 border-college-gold/70 h-64 sm:h-72 w-full bg-slate-100 flex items-center justify-center shadow-sm">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User className="w-14 h-14" />
                        </div>
                      )}
                      <span className="absolute top-2.5 right-2.5 bg-college-dark/95 text-college-gold text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-college-gold/40 shadow-sm z-10">
                        SIH {item.sihYear}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-base text-college-navy">
                        {item.name}
                      </h3>
                      <div className="text-xs font-medium text-slate-600">
                        {item.department} ({item.graduationYear})
                      </div>
                      <div className="text-[11px] text-college-accent font-semibold">
                        Team: {item.teamName}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded text-[10px] font-semibold w-full">
                        <Trophy className="w-3.5 h-3.5 text-college-gold shrink-0" />
                        <span className="truncate">{item.achievement}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed italic">
                        "{item.problemStatement}"
                      </p>
                    </div>
                  </div>

                  {item.company && (
                    <div className="mt-4 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                      Current: {item.currentRole} @ {item.company}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator for Mobile & Desktop Slideshow */}
          {totalItems > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              {alumniList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-college-navy'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-[11px] text-slate-500 italic">
          * Swipe or use arrow buttons to explore SIH Alumni entries.
        </div>

      </div>
    </section>
  );
}
