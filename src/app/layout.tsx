import type { Metadata } from 'next';
import './globals.css';

const CLOUDINARY_LOGO_URL = 'https://res.cloudinary.com/dwzv8izif/image/upload/v1788187698/sih-crre/official_college_logo.png';

export const metadata: Metadata = {
  metadataBase: new URL('https://sih.crre.site'),
  title: 'Internal SIH 2026 Portal | Sir C. R. Reddy College of Engineering',
  description: 'Internal Hackathon Portal for student team registration and screening at Sir C. R. Reddy College of Engineering (Autonomous), Eluru.',
  keywords: 'SIH 2026, Smart India Hackathon, Sir C.R. Reddy College of Engineering, CRR, Eluru, Internal Hackathon, Innovation Cell',
  icons: {
    icon: [
      { url: `${CLOUDINARY_LOGO_URL}`, type: 'image/png' },
      { url: '/favicon-32x32.png?v=crre2026', type: 'image/png' },
      { url: '/college-logo.png?v=crre2026', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=crre2026',
    apple: CLOUDINARY_LOGO_URL,
  },
  alternates: {
    canonical: 'https://sih.crre.site/',
  },
  openGraph: {
    title: 'Internal SIH 2026 Portal | Sir C. R. Reddy College of Engineering',
    description: 'Internal Hackathon Portal for student team registration and screening at Sir C. R. Reddy College of Engineering (Autonomous), Eluru.',
    url: 'https://sih.crre.site/',
    siteName: 'SIH 2026 CRR Internal Portal',
    images: [
      {
        url: CLOUDINARY_LOGO_URL,
        width: 643,
        height: 718,
        alt: 'Sir C. R. Reddy College of Engineering Logo',
      },
    ],
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
        <link rel="icon" href="https://res.cloudinary.com/dwzv8izif/image/upload/v1788187698/sih-crre/official_college_logo.png" type="image/png" />
        <link rel="icon" href="/favicon.ico?v=crre2026" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png?v=crre2026" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico?v=crre2026" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dwzv8izif/image/upload/v1788187698/sih-crre/official_college_logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-college-gold selection:text-college-dark">
        {children}
      </body>
    </html>
  );
}
