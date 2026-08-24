'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { HERO_DATA } from '@/data/placeholder';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT SIH', href: '/about' },
    { name: 'OUR SIH JOURNEY', href: '/#journey' },
    { name: 'ALUMNI', href: '/alumni' },
    { name: 'RESULTS', href: '/results' },
    { name: 'GUIDELINES', href: '/guidelines' },
    { name: 'REGISTER', href: '/register' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-slate-200">
      {/* Top Bar: Official College Branding & Accreditation */}
      <div className="bg-college-dark text-white text-xs py-1.5 px-3 sm:px-4 border-b border-college-navy">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1.5 text-center md:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1 bg-college-gold/20 text-college-goldLight px-2 py-0.5 rounded font-semibold text-[10px] sm:text-[11px]">
              <ShieldCheck className="w-3 h-3 text-college-gold shrink-0" />
              <span>AUTONOMOUS INSTITUTION</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-200 text-[10px] sm:text-[11px] font-medium">{HERO_DATA.accreditation}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-slate-300">
            <span>📍 Eluru, AP, India</span>
          </div>
        </div>
      </div>

      {/* Main College Header Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-6">
        <Link href="/" className="flex items-center gap-3 sm:gap-4 group min-w-0">
          {/* Official College Logo Image - Complete, Unframed, Prominent */}
          <div className="shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform py-0.5">
            <img
              src="/college-logo.png"
              alt="Sir C. R. Reddy College of Engineering Official Crest Logo"
              className="h-12 sm:h-16 md:h-20 w-auto max-w-[180px] sm:max-w-[240px] object-contain drop-shadow-sm"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-xs sm:text-base md:text-xl lg:text-2xl text-college-navy tracking-tight leading-tight group-hover:text-college-accent transition-colors truncate">
              {HERO_DATA.collegeName}
            </h1>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-college-gold font-serif tracking-wider">
                {HERO_DATA.collegeStatus}
              </span>
              <span className="text-slate-400 text-xs hidden xs:inline">•</span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-600 tracking-wide uppercase truncate">
                SIH 2026 Internal Portal
              </span>
            </div>
          </div>
        </Link>

        {/* SIH Official Logo Emblem & CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <img 
            src="https://www.sih.gov.in/img/sih2022-logo.png" 
            alt="Smart India Hackathon Official Logo" 
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs" 
          />
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-college-navy to-college-blue hover:from-college-blue hover:to-college-navy text-white px-5 py-2.5 rounded text-xs font-bold tracking-wider shadow-sm border border-college-gold/30 transition-all hover:shadow-md"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4 text-college-gold" />
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-college-navy text-white border-t border-b border-college-blue/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between">
          <nav className="hidden lg:flex items-center flex-wrap">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-3 text-xs font-semibold tracking-wider transition-colors border-b-2 ${
                    active
                      ? 'border-college-gold text-white bg-college-blue/50'
                      : 'border-transparent text-slate-200 hover:text-white hover:bg-college-blue/30 hover:border-college-gold/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="lg:hidden w-full flex items-center justify-between py-2">
            <span className="text-xs font-bold tracking-wider text-college-gold font-mono">
              SIH HACKATHON 2026
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded text-slate-200 hover:text-white hover:bg-college-blue focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-college-gold" /> : <Menu className="w-6 h-6 text-college-gold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-college-dark text-white border-b border-college-navy px-4 pt-3 pb-6 space-y-1.5 shadow-2xl">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3.5 py-3 rounded text-xs font-bold tracking-wider transition-colors ${
                  active
                    ? 'bg-college-blue text-college-gold border-l-4 border-college-gold'
                    : 'text-slate-200 hover:bg-college-navy hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-700 mt-3">
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-college-gold via-amber-500 to-college-gold text-college-dark font-extrabold text-xs py-3 px-4 rounded w-full tracking-wider shadow-md"
            >
              <span>REGISTER YOUR TEAM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
