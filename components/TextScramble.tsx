'use client';

import React, { useRef, useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890◆*#@$';
    const originalText = text;
    let isScrambled = false;

    const scramble = () => {
      if (isScrambled) return;
      isScrambled = true;

      const length = originalText.length;
      let frame = 0;
      const totalFrames = 30; // 30 ticks over 0.6s at 50fps

      const interval = setInterval(() => {
        let output = '';
        for (let i = 0; i < length; i++) {
          if (originalText[i] === ' ') {
            output += ' ';
            continue;
          }

          // Resolve characters progress
          const progress = frame / totalFrames;
          const threshold = progress * length;

          if (i < threshold) {
            output += originalText[i];
          } else {
            output += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        setDisplayText(output);
        frame++;

        if (frame > totalFrames) {
          setDisplayText(originalText);
          clearInterval(interval);
        }
      }, 20); // 20ms interval = ~50fps
    };

    // Register ScrollTrigger to trigger once on enter
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          scramble();
        },
      });
    });
  }, [text]);

  if (Component === 'h1') {
    return (
      <h1 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
        {displayText || text}
      </h1>
    );
  }
  if (Component === 'h2') {
    return (
      <h2 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
        {displayText || text}
      </h2>
    );
  }
  if (Component === 'h3') {
    return (
      <h3 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
        {displayText || text}
      </h3>
    );
  }
  if (Component === 'h4') {
    return (
      <h4 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
        {displayText || text}
      </h4>
    );
  }
  if (Component === 'p') {
    return (
      <p ref={containerRef as React.RefObject<HTMLParagraphElement>} className={className}>
        {displayText || text}
      </p>
    );
  }
  if (Component === 'div') {
    return (
      <div ref={containerRef as React.RefObject<HTMLDivElement>} className={className}>
        {displayText || text}
      </div>
    );
  }

  return (
    <span ref={containerRef as React.RefObject<HTMLSpanElement>} className={className}>
      {displayText || text}
    </span>
  );
};
export default TextScramble;
