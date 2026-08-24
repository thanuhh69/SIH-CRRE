'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMainVideo } from '@/lib/firestore';
import { VideoItem } from '@/types';
import { 
  Lightbulb, 
  Target, 
  Cpu, 
  Users, 
  Rocket, 
  HeartHandshake, 
  ShieldCheck, 
  Play, 
  Film, 
  Maximize2 
} from 'lucide-react';

export default function AboutSection() {
  const [videoData, setVideoData] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    getMainVideo().then(data => setVideoData(data));
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  const pillars = [
    {
      title: 'Innovation',
      desc: 'Encouraging students to think outside traditional academic boundaries and build breakthrough solutions.',
      icon: Lightbulb,
    },
    {
      title: 'Problem Solving',
      desc: 'Tackling authentic challenges posted by Union Ministries, State Governments, and leading Public Enterprises.',
      icon: Target,
    },
    {
      title: 'Technology',
      desc: 'Leveraging cutting-edge stacks—Artificial Intelligence, IoT, Blockchain, Cloud, and Embedded Hardware.',
      icon: Cpu,
    },
    {
      title: 'Teamwork',
      desc: 'Fostering interdisciplinary collaboration across CSE, ECE, IT, EEE, AI&DS, AI&ML, Cyber Security, Civil, and Mechanical departments.',
      icon: Users,
    },
    {
      title: 'Entrepreneurship',
      desc: 'Nurturing student hackathon prototypes into viable campus startups and intellectual properties.',
      icon: Rocket,
    },
    {
      title: 'Social Impact',
      desc: 'Solving ground-level issues in agriculture, healthcare, water safety, clean energy, and e-governance.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="text-xs font-bold text-college-gold uppercase tracking-widest mb-1">
            Sir C.R. Reddy College of Engineering (Autonomous)
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl text-college-navy mb-4 heading-accent-center">
            About Smart India Hackathon
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mt-4">
            Smart India Hackathon (SIH) is a nationwide initiative by the Ministry of Education's Innovation Cell to provide students with a platform to solve pressing problems of government ministries, departments, industries, and other organizations.
          </p>
        </motion.div>

        {/* Embedded SIH Promotional Video (Integrate Video directly inside About SIH section) */}
        {videoData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-slate-900 rounded-xl overflow-hidden shadow-xl border-2 border-college-gold/40"
          >
            <div className="bg-college-dark text-white px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold font-serif text-college-goldLight">
                <Film className="w-4 h-4 text-college-gold" />
                <span>SIH AT OUR COLLEGE – OFFICIAL MEDIA</span>
              </div>
              <span className="text-[10px] font-mono bg-college-gold/20 text-college-gold px-2 py-0.5 rounded border border-college-gold/30">
                DYNAMIC MANAGED VIDEO
              </span>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {isPlaying ? (
                videoData.source === 'youtube' || videoData.videoUrl.includes('youtube') || videoData.videoUrl.includes('youtu.be') ? (
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
                <div 
                  className="relative w-full h-full group cursor-pointer" 
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src={videoData.thumbnailUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200'}
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

            <div className="p-4 bg-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs text-slate-300">
              <div>
                <div className="font-bold text-white text-sm">{videoData.title}</div>
                <p className="text-slate-400 text-xs mt-0.5">{videoData.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Institutional Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div 
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, boxShadow: "0 12px 24px -6px rgba(11, 37, 69, 0.12)" }}
                className="college-card p-6 border border-slate-200 hover:border-college-gold/60 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded bg-college-light border border-college-border text-college-navy flex items-center justify-center mb-4 group-hover:bg-college-navy group-hover:text-college-gold transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-college-navy mb-2 group-hover:text-college-accent transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* College Commitment Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-college-light border-l-4 border-college-navy p-6 rounded-r shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-college-navy shrink-0 mt-1" />
            <div>
              <h4 className="font-serif font-bold text-college-navy text-base">
                Internal Selection & College Nomination
              </h4>
              <p className="text-slate-600 text-xs mt-1">
                The Internal Hackathon at Sir C.R. Reddy College of Engineering serves as the official screening round to evaluate, mentor, and nominate the top teams for the SIH 2026 National Grand Finale.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
