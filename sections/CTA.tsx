'use client';

import React, { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';
import { SplitHeading } from '../components/SplitHeading';
import { MagneticButton } from '../components/MagneticButton';
import { useBooking } from '../lib/context/BookingContext';

export const CTA = () => {
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const silhouetteRef = useRef<HTMLDivElement>(null);
  const hrRef = useRef<HTMLHRElement>(null);
  const primaryBtnRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  useEffect(() => {
    // 1. Savannah Parallax background (Speed 0.4: y: "-20%")
    const silhouette = silhouetteRef.current;
    if (silhouette) {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.fromTo(
          silhouette,
          { y: '0%' },
          {
            y: '-20%',
            ease: 'none',
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }

    // 2. Gold line draw-in on entry (scaleX 0 -> 1)
    const hr = hrRef.current;
    if (hr) {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.create({
          trigger: hr,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              hr,
              { scaleX: 0, transformOrigin: 'left' },
              { scaleX: 1, duration: 1.2, ease: 'power2.out' }
            );
          },
        });
      });
    }

    // 3. Idle breathing animation (Scale 1 -> 1.015) when idle for 3 seconds
    const btnContainer = primaryBtnRef.current;
    if (btnContainer) {
      const btn = btnContainer.querySelector('button');
      if (btn) {
        let breatheTween: gsap.core.Tween | null = null;
        let idleTimeout: NodeJS.Timeout;

        const startBreathing = () => {
          breatheTween = gsap.to(btn, {
            scale: 1.015,
            duration: 1.25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        };

        const stopBreathing = () => {
          if (breatheTween) {
            breatheTween.kill();
            breatheTween = null;
          }
          gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
        };

        const resetIdleTimer = () => {
          stopBreathing();
          clearTimeout(idleTimeout);
          idleTimeout = setTimeout(startBreathing, 3000);
        };

        // Attach listeners for interaction
        window.addEventListener('mousemove', resetIdleTimer);
        window.addEventListener('scroll', resetIdleTimer);
        btn.addEventListener('mouseenter', stopBreathing);
        btn.addEventListener('mouseleave', resetIdleTimer);

        // Initial trigger
        idleTimeout = setTimeout(startBreathing, 3000);

        return () => {
          window.removeEventListener('mousemove', resetIdleTimer);
          window.removeEventListener('scroll', resetIdleTimer);
          btn.removeEventListener('mouseenter', stopBreathing);
          btn.removeEventListener('mouseleave', resetIdleTimer);
          clearTimeout(idleTimeout);
          if (breatheTween) breatheTween.kill();
        };
      }
    }
  }, []);

  return (
    <section
      ref={ctaSectionRef}
      id="cta-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 bg-bg-base overflow-hidden select-none z-20"
    >
      {/* Gold Horizontal Rule Drawing in from left */}
      <hr
        ref={hrRef}
        className="w-full max-w-6xl border-t border-gold opacity-30 absolute top-0 left-1/2 -translate-x-1/2 will-change-transform"
      />

      {/* Savanna trees background silhouette absolute positioning */}
      <div
        ref={silhouetteRef}
        className="absolute bottom-[-50px] left-0 w-full h-[200px] md:h-[300px] pointer-events-none select-none opacity-10 z-10 will-change-transform"
      >
        <img
          src="/assets/savanna-silhouette.svg"
          alt="Savanna Landscape"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-20 text-center max-w-3xl flex flex-col items-center justify-center">
        {/* Upper Badge */}
        <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-mono font-medium block mb-6">
          Next-Gen Operating System
        </span>

        {/* Cinematic headline with line wraps */}
        <SplitHeading
          text="Elevate your safari operations | to ultra-luxury standards."
          italicText="safari operations"
          as="h2"
          type="lines"
          className="text-4xl md:text-6xl font-serif font-medium text-cream leading-tight text-center"
        />

        {/* Secondary description */}
        <p className="mt-6 text-sm md:text-base font-sans text-cream-muted font-light max-w-xl leading-relaxed">
          Standardize bookings, satellite safety logs, telemetry grids, and luxury lodge reservations on a single enterprise screen.
        </p>

        {/* CTA Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary breathing button wrapper */}
          <div ref={primaryBtnRef}>
            <MagneticButton 
              onClick={openBooking}
              className="shimmer-btn bg-gold hover:bg-gold-light text-cream font-mono text-xs tracking-wider uppercase px-8 py-4 rounded-[8px] border border-gold shadow-lg shadow-gold/10 transition-colors duration-300"
            >
              Launch Suite License
            </MagneticButton>
          </div>

          <MagneticButton 
            onClick={openBooking}
            className="bg-transparent hover:bg-cream/5 text-cream font-mono text-xs tracking-wider uppercase px-8 py-4 rounded-[8px] border border-border-warm transition-all duration-300"
          >
            Consult Systems Architect
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
export default CTA;
