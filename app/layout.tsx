import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/lib/lenis';
import { GrainOverlay } from '@/components/GrainOverlay';
import { CustomCursor } from '@/components/CustomCursor';
import { Preloader } from '@/components/Preloader';
import { BookingProvider } from '@/lib/context/BookingContext';
import { BookingModal } from '@/components/BookingModal';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Axelo Safari Suite — The Enterprise Safari Operations Platform',
  description:
    'Experience the cinematic, premium operations SaaS designed exclusively for luxury East African safari operators. Live fleet tracking, SOS networks, real-time weather intelligence, and L6 military-grade security audit logs.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://axelosafari.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Axelo Safari Suite — The Enterprise Safari Operations Platform',
    description:
      'Cinematic, premium operations SaaS designed exclusively for luxury East African safari operators.',
    url: 'https://axelosafari.com',
    siteName: 'Axelo Safari Suite',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${cormorant.variable} ${dmSans.variable} font-sans bg-bg-base text-cream antialiased selection:bg-gold selection:text-bg-base`}
      >
        <LenisProvider>
          <BookingProvider>
            {/* Global Cinematic Assets & Dynamic Systems */}
            <GrainOverlay />
            <CustomCursor />
            <Preloader />
            <BookingModal />
            
            {/* Main Website Wrapper */}
            <main id="app-root" className="relative min-h-screen">
              {children}
            </main>
          </BookingProvider>
        </LenisProvider>
      </body>
    </html>
  );
}

