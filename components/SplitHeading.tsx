'use client';

import React, { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';

interface SplitHeadingProps {
  text: string;
  className?: string;
  italicText?: string; // Optional portion of text to highlight in gold italic
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  type?: 'words' | 'lines';
  triggerEvent?: string; // e.g. 'preloader:done' to start immediately
  delay?: number;
}

export const SplitHeading: React.FC<SplitHeadingProps> = ({
  text,
  className = '',
  italicText = '',
  as: Component = 'h2',
  type = 'words',
  triggerEvent,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const animateWords = () => {
      const words = el.querySelectorAll('.split-word-inner');
      if (words.length === 0) return;

      gsap.fromTo(
        words,
        { y: 80, opacity: 0, rotate: 8 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          delay: delay,
          clearProps: 'transform,opacity,rotate',
        }
      );
    };

    const animateLines = () => {
      const lines = el.querySelectorAll('.split-line-inner');
      if (lines.length === 0) return;

      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              lines,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power2.out',
                stagger: 0.15,
                delay: delay,
                clearProps: 'transform,opacity',
              }
            );
          },
        });
      });
    };

    if (triggerEvent) {
      const handleTrigger = () => {
        if (type === 'words') {
          animateWords();
        } else {
          animateLines();
        }
      };

      window.addEventListener(triggerEvent, handleTrigger);
      
      // If event was already fired before listener mounted (rare but possible), trigger it
      return () => {
        window.removeEventListener(triggerEvent, handleTrigger);
      };
    } else {
      // Normal ScrollTrigger based animation
      if (type === 'words') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            once: true,
            onEnter: animateWords,
          });
        });
      } else {
        animateLines();
      }
    }
  }, [type, triggerEvent, delay]);

  // Splitting helper
  if (type === 'words') {
    const words = text.split(' ');
    return (
      <Component ref={containerRef as React.RefObject<HTMLHeadingElement>} className={`flex flex-wrap ${className}`}>
        {words.map((word, idx) => {
          // Check if word matches italic highlight criteria
          const isItalic = italicText && word.toLowerCase().includes(italicText.toLowerCase());
          return (
            <span key={idx} className="inline-block overflow-hidden mr-[0.22em] py-1">
              <span
                className={`inline-block split-word-inner will-change-transform ${
                  isItalic ? 'text-gold italic font-serif font-medium' : ''
                }`}
                style={{ display: 'inline-block' }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </Component>
    );
  }

  // Splitting helper for lines. Delimiter `|` provides perfect line breaks.
  const lines = text.includes('|') ? text.split('|') : [text];

  return (
    <Component ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
      {lines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden py-1">
          <span
            className="block split-line-inner will-change-transform"
            style={{ display: 'block' }}
          >
            {line.trim()}
          </span>
        </span>
      ))}
    </Component>
  );
};
export default SplitHeading;
