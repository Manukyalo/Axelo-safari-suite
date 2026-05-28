'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from './gsap';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Instantiate Lenis client-side only
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    setLenis(lenisInstance);

    // Sync with GSAP ticker
    const update = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Automatically synchronize ScrollTrigger with Lenis
    lenisInstance.on('scroll', () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.update();
      });
    });

    // Listen to custom preloader:done event to unlock scroll
    const handlePreloaderDone = () => {
      lenisInstance.start();
    };

    // Lock scroll initially for the cinematic preloader
    lenisInstance.stop();

    window.addEventListener('preloader:done', handlePreloaderDone);

    return () => {
      window.removeEventListener('preloader:done', handlePreloaderDone);
      gsap.ticker.remove(update);
      lenisInstance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};
export default LenisProvider;
