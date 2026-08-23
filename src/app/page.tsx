import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import AnnouncementBar from '@/components/AnnouncementBar';
import AboutSection from '@/components/AboutSection';
import JourneySection from '@/components/JourneySection';
import AlumniCarousel from '@/components/AlumniCarousel';
import WhyParticipate from '@/components/WhyParticipate';
import Timeline from '@/components/Timeline';
import ImportantDates from '@/components/ImportantDates';
import PrizeMoneySection from '@/components/PrizeMoneySection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <AnnouncementBar />
        <AboutSection />
        <PrizeMoneySection />
        <JourneySection />
        <AlumniCarousel />
        <WhyParticipate />
        <Timeline />
        <ImportantDates />
      </main>

      <Footer />
    </div>
  );
}
