'use client';

import React, { useEffect, useState } from 'react';
import { getMainVideo } from '@/lib/firestore';
import { VideoItem } from '@/types';
import { Play, Video, Film, Maximize2, ShieldAlert } from 'lucide-react';

export default function VideoSection() {
  const [videoData, setVideoData] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    getMainVideo().then(data => setVideoData(data));
  }, []);

  if (!videoData) return null;

  // Extract YouTube embed ID if applicable
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  return (
    <section className="py-16 bg-slate-900 text-white border-b-4 border-college-gold">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
            <Film className="w-4 h-4 text-college-gold" /> Media Showcase
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-white heading-accent-center mb-3">
            SIH at Our College
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mt-4">
            Watch the official overview of hackathons, student pitches, prototype demonstrations, and grand finale journey at Sir C.R. Reddy College of Engineering.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {isPlaying ? (
              videoData.source === 'youtube' ? (
                <iframe
                  src={getYouTubeEmbedUrl(videoData.videoUrl)}
                  title={videoData.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoData.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src={videoData.thumbnailUrl}
                  alt={videoData.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-college-gold/90 text-college-dark flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="bg-college-navy/90 text-college-gold text-[11px] font-mono px-2 py-0.5 rounded border border-college-gold/30">
                      Duration: {videoData.duration || '03:45'}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white mt-1">
                      {videoData.title}
                    </h3>
                  </div>
                  <span className="bg-white/10 hover:bg-white/20 p-2 rounded text-white text-xs backdrop-blur-sm">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-300">
            <div>
              <div className="font-semibold text-white text-sm">{videoData.title}</div>
              <p className="text-slate-400 mt-1">{videoData.description}</p>
            </div>
            <div className="shrink-0 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <ShieldAlert className="w-4 h-4 text-college-gold" />
              <span>Configurable via Admin Portal</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
