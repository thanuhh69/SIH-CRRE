import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sih.crre.site'),
  title: 'SIH 2026 – Sir C. R. Reddy College of Engineering',
  description: 'Smart India Hackathon 2026 Internal Hackathon Portal – Sir C. R. Reddy College of Engineering',
  keywords: 'SIH 2026, Smart India Hackathon, Sir C.R. Reddy College of Engineering, CRR, Eluru, Internal Hackathon, Innovation Cell, Engineering College',
  alternates: {
    canonical: 'https://sih.crre.site/',
  },
  openGraph: {
    title: 'SIH 2026 – Sir C. R. Reddy College of Engineering',
    description: 'Smart India Hackathon 2026 Internal Hackathon Portal – Sir C. R. Reddy College of Engineering',
    url: 'https://sih.crre.site/',
    siteName: 'SIH 2026 CRR Portal',
    locale: 'en_US',
    type: 'website',
  },
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
