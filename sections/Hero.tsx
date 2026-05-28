'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from '../lib/gsap';
import { SplitHeading } from '../components/SplitHeading';
import { MagneticButton } from '../components/MagneticButton';
import { useBooking } from '../lib/context/BookingContext';


export const Hero = () => {
  const [isStarted, setIsStarted] = useState(false);
  const { openBooking } = useBooking();
  const bgSilhouetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax Scroll for wildlife silhouette SVG at the bottom
    const silhouette = bgSilhouetteRef.current;
    if (silhouette) {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.to(silhouette, {
          y: '30%',
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }

    // Listener for preloader done event
    const handlePreloaderDone = () => {
      setIsStarted(true);
    };

    window.addEventListener('preloader:done', handlePreloaderDone);


    return () => {
      window.removeEventListener('preloader:done', handlePreloaderDone);
    };
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-24 md:pb-36 px-6 md:px-12 bg-bg-base overflow-hidden"
    >
      {/* Absolute Wildlife Silhouette Background with Parallax */}
      <div
        ref={bgSilhouetteRef}
        className="absolute bottom-0 left-0 w-full h-[180px] md:h-[280px] z-10 pointer-events-none select-none opacity-8 will-change-transform"
      >
        <img
          src="/assets/wildlife-horizon.svg"
          alt="Savanna Wildlife"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Main Hero Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center relative z-20 max-w-5xl mx-auto">
        {/* A) BADGE PILL */}
        {isStarted && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="mb-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold/10 border border-border-accent"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-mono font-medium">
              Next-Gen Safari Operations
            </span>
          </motion.div>
        )}

        {/* B) HEADLINE */}
        <SplitHeading
          triggerEvent="preloader:done"
          text="The Enterprise Safari Operations Platform."
          italicText="Operations Platform."
          as="h1"
          type="words"
          className="text-4xl md:text-7xl font-serif tracking-tight font-medium leading-[1.1] text-cream"
        />

        {/* C) SUBHEADLINE */}
        {isStarted && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="mt-6 text-sm md:text-lg text-cream-muted font-sans font-light max-w-2xl leading-relaxed"
          >
            Seamlessly orchestrating ultra-luxury guest experiences, military-grade SOS networks, and local wildlife conservation logs across East Africa.
          </motion.p>
        )}

        {/* D) CTA BUTTONS */}
        {isStarted && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <MagneticButton className="shimmer-btn bg-gold hover:bg-gold-light text-cream font-mono text-xs tracking-wider uppercase px-8 py-4 rounded-[8px] border border-gold shadow-lg shadow-gold/10 transition-colors duration-300 select-none">
                Explore the Platform
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.95 }}
            >
              <MagneticButton 
                onClick={openBooking}
                className="bg-transparent hover:bg-cream/5 text-cream font-mono text-xs tracking-wider uppercase px-8 py-4 rounded-[8px] border border-border-warm transition-all duration-300 select-none"
              >
                Book Private Demo
              </MagneticButton>
            </motion.div>
          </div>
        )}
      </div>


    </section>
  );
};
export default Hero;
