'use client';

import React, { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.183-1.359a9.95 9.95 0 004.825 1.239h.005c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.037-5.176-2.922-7.062A9.92 9.92 0 0012.012 2zm5.727 14.172c-.253.708-1.25 1.3-1.722 1.386-.473.085-.945.127-3.056-.708-2.544-1.007-4.179-3.587-4.306-3.757-.127-.17-1.017-1.352-1.017-2.578 0-1.226.633-1.83.86-1.83.18-.085.39-.127.608-.127.227 0 .506.085.772.355.266.27.79 1.93.859 2.072.069.141.114.308.016.502-.098.194-.147.308-.292.476-.145.168-.306.376-.438.505-.147.147-.301.308-.13.6.171.291.76 1.25 1.63 2.023.708.627 1.306.82 1.492.912.186.092.292.069.398-.053.106-.123.456-.531.579-.714.123-.183.245-.152.41-.092.164.06.315.27.315.48v2.052c0 .069-.045.138-.114.17-.069.034-.146.034-.207-.008L17.739 16.172z" />
  </svg>
);

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254731237251';

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    // Scroll triggered entrance for the whole footer as a single unit
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
      });
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-bg-base border-t border-gold/15 py-16 md:py-24 px-6 md:px-12 relative z-20 opacity-0 will-change-transform"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 mb-16">
        
        {/* Column 1: Brand Logo, Tagline & Socials */}
        <div className="flex flex-col space-y-5">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="flex items-center space-x-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/Logo/Axelo Logo.jpeg" 
              alt="Axelo Safari Suite Logo" 
              className="h-8 w-8 object-cover rounded-lg border border-gold/30 group-hover:border-gold/60 transition-colors duration-300"
            />
            <div className="flex items-center space-x-1">
              <span className="text-xl md:text-2xl font-serif font-semibold text-cream">
                Axelo
              </span>
              <span className="text-xl md:text-2xl font-serif text-gold italic font-medium">
                Safari Suite
              </span>
            </div>
          </a>
          <p className="text-xs md:text-sm text-cream-muted font-sans font-light leading-relaxed max-w-sm">
            The definitive enterprise operating system orchestrating ultra-luxury guest journeys, satellite safety tracking, and high-conversion reservation engines.
          </p>
          
          {/* Social Icons Group */}
          <div className="flex items-center space-x-3 pt-2">
            <a 
              href="https://www.instagram.com/axelo_safari_suite?igsh=ZnljamQ3OXI0YnJ5" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-lg border border-border-warm bg-bg-surface/30 flex items-center justify-center text-cream-muted hover:text-gold hover:border-gold/40 hover:bg-bg-surface transition-all duration-300"
              aria-label="Instagram Link"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Axelo%20Team,%20I'd%20like%20to%20learn%20more%20about%20the%20Safari%20Suite.`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-lg border border-border-warm bg-bg-surface/30 flex items-center justify-center text-cream-muted hover:text-gold hover:border-gold/40 hover:bg-bg-surface transition-all duration-300"
              aria-label="WhatsApp Link"
            >
              <WhatsAppIcon className="w-4 h-4 text-green-500/80" />
            </a>
            <a 
              href="mailto:concierge@axelosafari.com" 
              className="w-9 h-9 rounded-lg border border-border-warm bg-bg-surface/30 flex items-center justify-center text-cream-muted hover:text-gold hover:border-gold/40 hover:bg-bg-surface transition-all duration-300"
              aria-label="Email Link"
            >
              <MailIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: System Links */}
        <div className="flex flex-col space-y-4 md:pl-12">
          <h4 className="text-xs font-mono font-bold tracking-[0.2em] text-gold uppercase">
            OPERATING MODULES
          </h4>
          <ul className="flex flex-col space-y-2.5">
            <li>
              <a href="#features" className="link-underline text-xs tracking-wider font-mono">
                Emergency SOS Broadcast
              </a>
            </li>
            <li>
              <a href="#features" className="link-underline text-xs tracking-wider font-mono">
                Live Telemetry Watchdog
              </a>
            </li>
            <li>
              <a href="#features" className="link-underline text-xs tracking-wider font-mono">
                Connected Fleet Control
              </a>
            </li>
            <li>
              <a href="#pricing" className="link-underline text-xs tracking-wider font-mono">
                Concession Reservations
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom copyright and trademark info */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-border-warm flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-cream-ghost">
        <span>© 2025 Axelo Technologies Ltd · Nairobi, Kenya</span>
        <div className="flex items-center space-x-6">
          <a href="/privacy-policy" className="hover:text-cream transition-colors duration-300">Privacy Policy</a>
          <span>·</span>
          <a href="/concession-terms" className="hover:text-cream transition-colors duration-300">Concession Terms</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
