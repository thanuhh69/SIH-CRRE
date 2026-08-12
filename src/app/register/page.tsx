import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegistrationForm from '@/components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-5xl mx-auto px-4">
          <RegistrationForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
