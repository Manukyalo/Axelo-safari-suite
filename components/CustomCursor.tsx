'use client';

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState<'none' | 'button' | 'card'>('none');

  // Track coordinates
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device is mobile/touch (coarse pointer)
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    // Apply cursor: none to html to hide default browser cursor
    document.documentElement.style.cursor = 'none';
    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      
      // Instantly position the inner dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if hovering a button, link, CTA or interactive element
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.interactive-hover') ||
        target.getAttribute('role') === 'button';

      // Check if hovering a feature card
      const isCard = target.closest('.feature-card');

      if (isInteractive) {
        setHoverType('button');
      } else if (isCard) {
        setHoverType('card');
      } else {
        setHoverType('none');
      }
    };

    const onMouseLeaveWindow = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const onMouseEnterWindow = () => {
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    // Lerp follow loop
    let animationFrameId: number;
    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

    const render = () => {
      ringCoords.current.x = lerp(ringCoords.current.x, mouseCoords.current.x, 0.12);
      ringCoords.current.y = lerp(ringCoords.current.y, mouseCoords.current.y, 0.12);

      if (ringRef.current) {
        // Adjust for half width of cursor (32px / 2 = 16px)
        ringRef.current.style.transform = `translate3d(${ringCoords.current.x - 16}px, ${ringCoords.current.y - 16}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Trailing Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-gold pointer-events-none z-[10000] mix-blend-difference will-change-transform transition-all duration-300 ease-out ${
          hoverType === 'button'
            ? 'w-16 h-16 !-translate-x-4 !-translate-y-4 bg-gold/15 border-gold scale-100'
            : hoverType === 'card'
            ? 'w-10 h-10 !-translate-x-1 !-translate-y-1 !rounded-[4px] border-gold/75 rotate-45'
            : ''
        }`}
      />
      
      {/* Instant Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full pointer-events-none z-[10001] will-change-transform transition-opacity duration-300"
      />
    </>
  );
};
export default CustomCursor;
