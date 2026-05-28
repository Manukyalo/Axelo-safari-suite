'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from '../lib/gsap';
import { MagneticButton } from './MagneticButton';
import { useBooking } from '../lib/context/BookingContext';

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.183-1.359a9.95 9.95 0 004.825 1.239h.005c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.037-5.176-2.922-7.062A9.92 9.92 0 0012.012 2zm5.727 14.172c-.253.708-1.25 1.3-1.722 1.386-.473.085-.945.127-3.056-.708-2.544-1.007-4.179-3.587-4.306-3.757-.127-.17-1.017-1.352-1.017-2.578 0-1.226.633-1.83.86-1.83.18-.085.39-.127.608-.127.227 0 .506.085.772.355.266.27.79 1.93.859 2.072.069.141.114.308.016.502-.098.194-.147.308-.292.476-.145.168-.306.376-.438.505-.147.147-.301.308-.13.6.171.291.76 1.25 1.63 2.023.708.627 1.306.82 1.492.912.186.092.292.069.398-.053.106-.123.456-.531.579-.714.123-.183.245-.152.41-.092.164.06.315.27.315.48v2.052c0 .069-.045.138-.114.17-.069.034-.146.034-.207-.008L17.739 16.172z" />
  </svg>
);

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254731237251';

  // Nav scroll background animation using GSAP
  useEffect(() => {
    const handleScroll = () => {
      const el = navRef.current;
      if (!el) return;
      if (window.scrollY > 80) {
        gsap.to(el, {
          backgroundColor: 'rgba(22, 18, 9, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(44, 36, 24, 0.5)',
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          backdropFilter: 'blur(0px)',
          borderBottom: '1px solid rgba(44, 36, 24, 0)',
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SOS Network', href: '#features' },
    { name: 'Operations', href: '#spotlight' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Fleet Control', href: '#features' },
  ];

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 2.2 }}
        className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-5 flex items-center justify-between transition-shadow duration-300"
      >
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2.5 group z-[60]">
          <img 
            src="/Logo/Axelo Logo.jpeg" 
            alt="Axelo Safari Suite Logo" 
            className="h-8 w-8 object-cover rounded-lg border border-gold/30 group-hover:border-gold/60 transition-colors duration-300"
          />
          <div className="flex items-center space-x-1">
            <span className="text-lg md:text-xl font-serif font-semibold tracking-wide text-cream transition-colors duration-300">
              Axelo
            </span>
            <span className="text-lg md:text-xl font-serif text-gold italic font-medium transition-colors duration-300">
              Safari Suite
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="link-underline text-xs tracking-widest uppercase font-mono py-1"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <MagneticButton 
            onClick={openBooking}
            className="shimmer-btn bg-gold hover:bg-gold-light text-cream font-mono text-xs tracking-wider uppercase px-6 py-3 rounded-[8px] border border-gold transition-colors duration-300 select-none shadow-lg shadow-gold/10"
          >
            Book a Demo
          </MagneticButton>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-end space-y-1.5 w-8 h-8 z-[60] focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[1.5px] bg-cream transition-all duration-300 ${
              isOpen ? 'w-6 rotate-45 translate-y-[5px]' : 'w-6'
            }`}
          />
          <span
            className={`block h-[1.5px] bg-cream transition-all duration-300 ${
              isOpen ? 'w-0 opacity-0' : 'w-4'
            }`}
          />
          <span
            className={`block h-[1.5px] bg-cream transition-all duration-300 ${
              isOpen ? 'w-6 -rotate-45 -translate-y-[5px]' : 'w-5'
            }`}
          />
        </button>
      </motion.nav>

      {/* Mobile Slide-down Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-bg-surface z-40 flex flex-col justify-center px-8 md:px-16"
          >
            {/* Background Accent SVG */}
            <div className="absolute top-20 right-10 text-[10vw] font-serif text-cream-ghost opacity-[0.03] select-none pointer-events-none italic">
              Axelo
            </div>

            <div className="flex flex-col space-y-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + idx * 0.08,
                    ease: 'easeOut',
                  }}
                  key={link.name}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-serif text-cream hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.15 + navLinks.length * 0.08 }}
                className="pt-6"
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openBooking();
                  }}
                  className="w-full inline-block text-center bg-gold text-cream font-mono text-sm tracking-wider uppercase py-4 rounded-[8px] border border-gold hover:bg-gold-light transition-colors duration-300"
                >
                  Book a Demo
                </button>
              </motion.div>
            </div>

            {/* Mobile Footer Area with Socials */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-col space-y-4 border-t border-border-warm pt-4">
              <div className="flex items-center justify-between text-xs font-mono text-cream-muted">
                <span>Nairobi, Kenya</span>
                <span>© 2025 Axelo Tech</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-cream-muted">
                <a 
                  href="https://www.instagram.com/axelo_safari_suite?igsh=ZnljamQ3OXI0YnJ5" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gold transition-colors duration-300 flex items-center space-x-1.5 text-xs font-mono"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
                <a 
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Axelo%20Team,%20I'd%20like%20to%20learn%20more%20about%20the%20Safari%20Suite.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gold transition-colors duration-300 flex items-center space-x-1.5 text-xs font-mono"
                >
                  <WhatsAppIcon className="w-4 h-4 text-green-500" />
                  <span>WhatsApp</span>
                </a>
                <a 
                  href="mailto:concierge@axelosafari.com" 
                  className="hover:text-gold transition-colors duration-300 flex items-center space-x-1.5 text-xs font-mono"
                >
                  <MailIcon className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
