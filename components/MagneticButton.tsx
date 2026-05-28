'use client';

import React, { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull translate by offset * 0.3 (up to 8px max pull)
      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const onMouseLeave = () => {
      // Return with standard luxury spring elastic overshoot
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.15, 0.42)',
      });
    };

    button.addEventListener('mousemove', onMouseMove);
    button.addEventListener('mouseleave', onMouseLeave);

    return () => {
      button.removeEventListener('mousemove', onMouseMove);
      button.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center will-change-transform ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default MagneticButton;
