import React from 'react';
import Link from 'next/link';
import { Award, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { HERO_DATA } from '@/data/placeholder';

export default function Footer() {
  return (
    <footer className="bg-college-dark text-slate-300 text-xs border-t-4 border-college-gold">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: Institutional Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 flex items-center justify-center border border-college-gold shrink-0 overflow-hidden">
              <img
                src="/college-logo.png"
                alt="Sir C. R. Reddy College of Engineering Official Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-sm tracking-tight leading-tight">
                {HERO_DATA.collegeName}
              </h3>
              <p className="text-college-gold font-semibold text-[11px]">{HERO_DATA.collegeStatus}</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Organized by the SIH Committee & Innovation Cell at Sir C.R. Reddy College of Engineering, Eluru. Empowering young minds to innovate for national challenges.
          </p>
          <div className="flex items-center gap-1.5 text-college-goldLight text-[11px]">
            <ShieldCheck className="w-4 h-4 text-college-gold shrink-0" />
            <span>AICTE Approved · JNTUK Affiliated · NBA & NAAC Accredited</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-white text-sm border-b border-slate-700 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-college-gold"></span> Quick Links
          </h4>
          <ul className="space-y-2">
            {[
              { name: 'Home', href: '/' },
              { name: 'About SIH', href: '/about' },
              { name: 'SIH Alumni Showcase', href: '/alumni' },
              { name: 'Problem Statements 2026', href: '/problems' },
              { name: 'Guidelines & Instructions', href: '/guidelines' },
              { name: 'Team Registration', href: '/register' },
              { name: 'Admin Portal', href: '/admin' },
            ].map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <span className="text-college-gold">›</span> {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Official SIH Portals & External References */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-white text-sm border-b border-slate-700 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-college-gold"></span> Official Resources
          </h4>
          <ul className="space-y-2.5 text-slate-300">
            <li>
              <a 
                href="https://sircrrcoestd.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-college-gold transition-colors flex items-center gap-2"
              >
                <span>College Main Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a 
                href="https://www.sih.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-college-gold transition-colors flex items-center gap-2"
              >
                <span>Smart India Hackathon National Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a 
                href="https://mic.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-college-gold transition-colors flex items-center gap-2"
              >
                <span>Ministry of Education Innovation Cell (MIC)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Information Placeholder */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-white text-sm border-b border-slate-700 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-college-gold"></span> Contact Helpdesk
          </h4>
          <ul className="space-y-2.5 text-slate-300 text-[11px]">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-college-gold shrink-0 mt-0.5" />
              <span>Sir C.R. Reddy College of Engineering, Vatluru, Eluru - 534007, Andhra Pradesh, India.</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-college-gold shrink-0" />
              <span>sih2026@sircrrcoestd.in</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-college-gold shrink-0" />
              <span>+91 8812 230840 / SIH Convenor Office</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="bg-black/40 border-t border-slate-800 py-4 px-4 text-slate-400 text-center text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Sir C.R. Reddy College of Engineering. All Rights Reserved.</p>
          <p className="text-slate-500">Smart India Hackathon Internal Hackathon 2026 Official Portal</p>
        </div>
      </div>
    </footer>
  );
}
