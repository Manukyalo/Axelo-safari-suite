'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from '../lib/gsap';

export const Preloader = () => {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Lock body scrolling during preload
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const counterVal = { value: 0 };
      const timeline = gsap.timeline({
        onComplete: () => {
          // Unlock body scroll
          document.body.style.overflow = '';
          // Dispatch custom event to let Hero know to start entrance
          window.dispatchEvent(new CustomEvent('preloader:done'));
        }
      });

      // 1. Initial logo opacity reset & animate counter to 100
      timeline.to(logoRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      });

      timeline.to(counterVal, {
        value: 100,
        duration: 1.8,
        ease: 'power1.inOut',
        onUpdate: () => {
          setCount(Math.floor(counterVal.value));
        },
      }, '<+=0.1');

      // 2. Once counter reaches 100, fade out counter and fade in logo fully
      timeline.to(counterWrapperRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      });

      // 3. Upward clip-path wipe transition to reveal the app
      timeline.to(containerRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.95,
        ease: 'power4.inOut',
      }, '+=0.2');

    });

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-bg-base z-[9998] flex flex-col justify-between p-8 md:p-16 select-none pointer-events-none"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        willChange: 'clip-path',
      }}
    >
      {/* Top Brand Name */}
      <div className="text-cream-ghost text-xs tracking-[0.25em] uppercase font-sans">
        Enterprise Safari Operations
      </div>

      {/* Center Logo */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1
          ref={logoRef}
          className="text-4xl md:text-6xl font-serif tracking-wide opacity-0 text-cream text-center"
        >
          Axelo <span className="text-gold italic font-medium">Safari Suite</span>
        </h1>
      </div>

      {/* Bottom Counter & Loading Indicator */}
      <div 
        ref={counterWrapperRef}
        className="flex items-end justify-between font-mono text-cream/70"
      >
        <div className="text-xs uppercase tracking-widest text-cream-ghost">
          Initializing System
        </div>
        <div 
          ref={counterRef}
          className="text-7xl md:text-9xl font-serif text-gold font-light tabular-nums leading-none"
        >
          {count}
        </div>
      </div>
    </div>
  );
};
export default Preloader;
