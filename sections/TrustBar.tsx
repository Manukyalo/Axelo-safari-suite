'use client';

import React from 'react';

export const TrustBar = () => {
  const items = [
    'Serengeti',
    'Masai Mara',
    'Amboseli',
    'Tsavo',
    'Ngorongoro',
    'Nairobi NP',
    'Samburu',
    'Lake Nakuru',
    'Bwindi',
    'Okavango',
  ];

  return (
    <section className="relative w-full py-8 bg-bg-surface border-y border-border-warm overflow-hidden select-none z-20">
      {/* Side Fade Gradient Overlays for Cinematic Transition */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

      {/* Marquee Track Container */}
      <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused] whitespace-nowrap cursor-default">
        {/* First Loop list */}
        <div className="flex items-center space-x-12 px-6">
          {items.map((item, index) => (
            <div key={`group1-${index}`} className="flex items-center space-x-12">
              <span className="text-cream-muted hover:text-cream text-xs md:text-sm font-mono tracking-[0.2em] uppercase transition-colors duration-300">
                {item}
              </span>
              <span className="text-gold font-light text-xs">◆</span>
            </div>
          ))}
        </div>

        {/* Duplicate Loop list for Seamless Infinite Transition */}
        <div className="flex items-center space-x-12 px-6">
          {items.map((item, index) => (
            <div key={`group2-${index}`} className="flex items-center space-x-12">
              <span className="text-cream-muted hover:text-cream text-xs md:text-sm font-mono tracking-[0.2em] uppercase transition-colors duration-300">
                {item}
              </span>
              <span className="text-gold font-light text-xs">◆</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TrustBar;
