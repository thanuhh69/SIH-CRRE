import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIH Internal Hackathon 2026 | Sir C.R. Reddy College of Engineering (Autonomous)',
  description: 'Official Smart India Hackathon (SIH) 2026 Internal Hackathon Portal for Sir C.R. Reddy College of Engineering (Autonomous), Eluru, Andhra Pradesh.',
  keywords: 'SIH 2026, Smart India Hackathon, Sir C.R. Reddy College of Engineering, CRR, Eluru, Internal Hackathon, Innovation Cell, Engineering College',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-college-gold selection:text-college-dark">
        {children}
      </body>
    </html>
  );
}
