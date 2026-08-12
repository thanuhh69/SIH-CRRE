'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, ArrowRight, AlertCircle } from 'lucide-react';
import { getAnnouncements } from '@/lib/firestore';
import { Announcement } from '@/types';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnouncements().then(data => {
      setAnnouncements(data.filter(a => a.active));
    });
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-slate-800 text-xs py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden w-full md:w-auto">
          <span className="inline-flex items-center gap-1 bg-red-700 text-white font-bold px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 shadow-sm">
            <Bell className="w-3 h-3 animate-bounce" /> OFFICIAL NOTICE
          </span>
          <div className="truncate font-medium text-slate-900 text-xs sm:text-sm">
            {announcements[0]?.title}
          </div>
        </div>

        {announcements[0]?.link && (
          <Link
            href={announcements[0].link}
            className="shrink-0 inline-flex items-center gap-1 font-bold text-college-navy hover:text-college-accent hover:underline text-xs bg-white border border-amber-300 px-3 py-1 rounded shadow-xs"
          >
            <span>Action Link</span>
            <ArrowRight className="w-3.5 h-3.5 text-college-gold" />
          </Link>
        )}
      </div>
    </div>
  );
}
