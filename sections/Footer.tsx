'use client';

import React, { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
        
        {/* Column 1: Brand Logo & Tagline */}
        <div className="flex flex-col space-y-4">
          <a href="#" className="flex items-center space-x-1">
            <span className="text-xl md:text-2xl font-serif font-semibold text-cream">
              Axelo
            </span>
            <span className="text-xl md:text-2xl font-serif text-gold italic font-medium">
              Safari Suite
            </span>
          </a>
          <p className="text-xs md:text-sm text-cream-muted font-sans font-light leading-relaxed max-w-sm">
            The definitive enterprise operating system orchestrating ultra-luxury guest journeys, satellite safety tracking, and high-conversion reservation engines.
          </p>
        </div>

        {/* Column 2: System Links */}
        <div className="flex flex-col space-y-4">
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

        {/* Column 3: Contact & Headquarters */}
        <div className="flex flex-col space-y-4 text-xs font-sans text-cream-muted font-light leading-relaxed">
          <h4 className="text-xs font-mono font-bold tracking-[0.2em] text-gold uppercase mb-1">
            DISPATCH HQ
          </h4>
          <p>
            Axelo Technologies Ltd<br />
            Level 6, Axelo Heights<br />
            General Mathenge Rd, Westlands<br />
            Nairobi, Kenya
          </p>
          <div className="pt-2">
            <span className="text-cream font-mono">Operations: </span>
            <a href="mailto:concierge@axelosafari.com" className="link-underline font-mono">
              concierge@axelosafari.com
            </a>
          </div>
        </div>

      </div>

      {/* Footer Bottom copyright and trademark info */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-border-warm flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-cream-ghost">
        <span>© 2025 Axelo Technologies Ltd · Nairobi, Kenya</span>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-cream transition-colors duration-300">Privacy Policy</a>
          <span>·</span>
          <a href="#" className="hover:text-cream transition-colors duration-300">Concession Terms</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
