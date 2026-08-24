'use client';

import React, { useEffect, useState } from 'react';
import { getEventDates, subscribeEventDates } from '@/lib/firestore';
import { EventDate } from '@/types';
import { Calendar, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';

export default function ImportantDates() {
  const [events, setEvents] = useState<EventDate[]>([]);

  useEffect(() => {
    getEventDates().then(data => setEvents(data));
    const unsubscribe = subscribeEventDates(data => setEvents(data));
    return () => unsubscribe();
  }, []);

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Description Header */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-bold text-college-gold uppercase tracking-widest">
              Institutional Notice Board
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-college-navy heading-accent">
              Important Dates & Schedule
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              Official schedule for SIH Internal Hackathon 2026 at Sir C.R. Reddy College of Engineering. The main campus hackathon will take place on <strong>15th & 16th September 2026</strong>.
            </p>

            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Internal Hackathon Event Dates</span>
              </div>
              <p className="text-[11px] leading-tight text-amber-800">
                Mark your calendar: <strong>15th & 16th September 2026</strong>. All registered team leaders must report to campus with complete project prototypes.
              </p>
            </div>
          </div>

          {/* Right Notice List */}
          <div className="lg:col-span-8">
            <div className="college-card border border-slate-300 overflow-hidden divide-y divide-slate-200">
              <div className="bg-college-navy text-white px-5 py-3 flex items-center justify-between font-serif font-bold text-xs">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-college-gold" /> SCHEDULE OF EVENTS
                </span>
                <span className="text-[10px] font-mono font-normal text-slate-300">
                  STATUS: SUBJECT TO REVISION
                </span>
              </div>

              {events.map((evt) => (
                <div 
                  key={evt.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 text-college-navy flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-college-navy">
                        {evt.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {evt.location}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-college-accent font-semibold">{evt.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <div className="px-3.5 py-1 rounded bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-college-gold" />
                      <span>{evt.date}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                      {evt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
