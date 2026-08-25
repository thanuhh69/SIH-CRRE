import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sih.crre.site'),
  title: 'Internal SIH 2026 Portal | Sir C. R. Reddy College of Engineering',
  description: 'Internal Hackathon Portal for student team registration and screening at Sir C. R. Reddy College of Engineering (Autonomous), Eluru.',
  keywords: 'SIH 2026, Smart India Hackathon, Sir C.R. Reddy College of Engineering, CRR, Eluru, Internal Hackathon, Innovation Cell',
  alternates: {
    canonical: 'https://sih.crre.site/',
  },
  openGraph: {
    title: 'Internal SIH 2026 Portal | Sir C. R. Reddy College of Engineering',
    description: 'Internal Hackathon Portal for student team registration and screening at Sir C. R. Reddy College of Engineering (Autonomous), Eluru.',
    url: 'https://sih.crre.site/',
    siteName: 'SIH 2026 CRR Internal Portal',
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
