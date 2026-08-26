'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Building2, Award } from 'lucide-react';
import { subscribeSlideshowImages, getSlideshowImages } from '@/lib/firestore';
import { SlideshowImage } from '@/types';

const DEFAULT_SLIDES: SlideshowImage[] = [
  {
    id: 'slide-1',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    title: 'Sir C.R. Reddy CoE Campus & Innovation Hub',
    caption: 'State-of-the-art research laboratories, computer centers, and student hackathon spaces.',
    createdAt: new Date().toISOString(),
    order: 1
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    title: 'Smart India Hackathon Evaluation & Pitching',
    caption: 'Student teams presenting prototype solutions to domain experts and ministry evaluators.',
    createdAt: new Date().toISOString(),
    order: 2
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    title: 'Collaborative Teamwork & Hardware Prototyping',
    caption: 'Interdisciplinary teams assembling IoT circuits and AI algorithms.',
    createdAt: new Date().toISOString(),
    order: 3
  }
];

export default function CollegeSlideshow() {
  const [images, setImages] = useState<SlideshowImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getSlideshowImages().then(list => {
      if (list && list.length > 0) setImages(list);
      else setImages(DEFAULT_SLIDES);
    });
    const unsubscribe = subscribeSlideshowImages((list) => {
      if (list && list.length > 0) setImages(list);
      else setImages(DEFAULT_SLIDES);
    });
    return () => unsubscribe();
  }, []);

  const activeImages = images.length > 0 ? images : DEFAULT_SLIDES;

  // Auto-play interval
  useEffect(() => {
    if (activeImages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeImages.length, isPaused]);

  const currentSlide = activeImages[currentIndex] || activeImages[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-900 via-college-dark to-slate-900 text-white border-b-4 border-college-gold overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-college-gold uppercase tracking-widest bg-college-gold/10 px-3 py-1 rounded border border-college-gold/30">
            <Building2 className="w-3.5 h-3.5 text-college-gold" />
            <span>Institutional Campus Life & Innovation</span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Sir C.R. Reddy CoE Gallery & Achievements
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
            Glimpses of campus infrastructure, previous hackathons, research labs, student project evaluation, and institutional milestones.
          </p>
        </div>

        {/* Main Slideshow Container */}
        <div 
          className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-college-gold/40 bg-black aspect-[16/9] sm:aspect-[21/9]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id || currentIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentSlide.url}
                alt={currentSlide.title || 'Sir C.R. Reddy CoE Campus Gallery'}
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient Dark Overlay for Typography Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Caption Banner */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20 flex flex-col justify-end text-left pointer-events-none">
            <motion.div
              key={`caption-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl space-y-1 sm:space-y-2"
            >
              <span className="inline-flex items-center gap-1.5 bg-college-gold text-college-dark px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Feature {currentIndex + 1} of {activeImages.length}</span>
              </span>
              <h3 className="font-serif font-bold text-base sm:text-xl md:text-2xl text-white tracking-wide drop-shadow-md">
                {currentSlide.title}
              </h3>
              {currentSlide.caption && (
                <p className="text-slate-200 text-xs sm:text-sm font-light leading-relaxed drop-shadow-sm max-w-xl line-clamp-2">
                  {currentSlide.caption}
                </p>
              )}
            </motion.div>
          </div>

          {/* Previous / Next Controls */}
          {activeImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-college-gold hover:text-college-dark text-white backdrop-blur-md transition-all border border-white/20 hover:border-college-gold shadow-lg"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-college-gold hover:text-college-dark text-white backdrop-blur-md transition-all border border-white/20 hover:border-college-gold shadow-lg"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {activeImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === idx ? 'w-6 bg-college-gold' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
