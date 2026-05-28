'use client';

import React from 'react';

export const GrainOverlay = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-[9999]"
      style={{ opacity: 0.03 }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="grainy-noise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="monochrome" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy-noise)" />
      </svg>
    </div>
  );
};
export default GrainOverlay;
