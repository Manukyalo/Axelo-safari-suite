'use client';

import React, { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';
import { SplitHeading } from '../components/SplitHeading';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { 
  ShieldAlert, 
  Eye, 
  CloudSun, 
  Map, 
  CalendarDays, 
  ShieldCheck 
} from 'lucide-react';

interface FeatureItem {
  id: number;
  icon: any;
  iconBg: string;
  accentColor: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
}

const FeatureCard: React.FC<{ card: FeatureItem; index: number }> = ({ card, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer Motion values for smooth physical springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 200, mass: 0.5 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const isOdd = index % 2 !== 0;
    const yVal = isOdd ? 15 : 30;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.fromTo(
        cardEl,
        { y: yVal },
        {
          y: -yVal,
          ease: 'none',
          scrollTrigger: {
            trigger: cardEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation limits
    rotateX.set(-((y - centerY) / rect.height) * 12);
    rotateY.set(((x - centerX) / rect.width) * 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const backgroundGlow = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${card.accentColor}1A, transparent 80%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className="feature-card relative flex flex-col justify-between p-8 rounded-xl bg-bg-surface border border-border-warm hover:border-gold/30 hover:bg-bg-lift transition-colors duration-350 ease-out h-[360px] group shadow-lg overflow-hidden will-change-transform"
    >
      {/* Dynamic Glow using Framer Motion */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none z-0"
        style={{ background: backgroundGlow }}
      />

      <div className="relative z-10">
        {/* Header (Icon + Eyebrow) */}
        <div className="flex items-center space-x-4 mb-5">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center text-cream"
            style={{ backgroundColor: card.iconBg }}
          >
            <card.icon className="w-5 h-5" />
          </div>
          <span 
            className="text-[10px] tracking-[0.2em] font-mono font-medium uppercase"
            style={{ color: card.accentColor }}
          >
            {card.eyebrow}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-semibold text-cream mb-3">
          {card.title}
        </h3>

        {/* Body */}
        <p className="text-[13px] font-sans text-cream-muted font-light leading-relaxed mb-4">
          {card.body}
        </p>
      </div>

      {/* Bullets */}
      <ul className="space-y-2 mt-auto">
        {card.bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-center space-x-2 text-xs text-cream-muted">
            <span 
              className="w-1.5 h-1.5 rounded-full inline-block shrink-0" 
              style={{ backgroundColor: card.accentColor }}
            />
            <span className="font-sans font-light">{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export const Features = () => {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const featuresList: FeatureItem[] = [
    {
      id: 1,
      icon: ShieldAlert,
      iconBg: '#C44830',
      accentColor: '#C44830',
      eyebrow: 'SOS NETWORK',
      title: 'Emergency SOS Broadcast',
      body: 'Offline satellite mesh integration providing real-time ranger coordinates and automated emergency response protocols across the savanna.',
      bullets: [
        'Satellite mesh connectivity (offline-ready)',
        'Automated multi-point ranger alerts',
      ],
    },
    {
      id: 2,
      icon: Eye,
      iconBg: '#7A5518',
      accentColor: '#E8A84E',
      eyebrow: 'OPERATIONS WATCHDOG',
      title: 'Real-Time Telemetry Desk',
      body: 'Live visual tracker mapping game drive routes, asset positions, and mechanical health statuses to predict maintenance intervals.',
      bullets: [
        'Interactive route path heatmaps',
        'Predictive engine failure alerts',
      ],
    },
    {
      id: 3,
      icon: CloudSun,
      iconBg: '#3D6B56',
      accentColor: '#5D9B7E',
      eyebrow: 'METEOROLOGICAL ENGINE',
      title: 'Savanna Micro-Climate Grid',
      body: 'Proprietary hyper-localized weather systems forecasting rainfall, wind metrics, and sun exposures up to the lodge perimeter.',
      bullets: [
        'Lodge-level microclimate sensor arrays',
        'Hour-by-hour visual safari guides',
      ],
    },
    {
      id: 4,
      icon: Map,
      iconBg: '#7A5518',
      accentColor: '#C4882C',
      eyebrow: 'TELEMETRY & LOGISTICS',
      title: 'Connected Fleet Workspace',
      body: 'Smart dashboard displaying real-time speed indicators, tire diagnostics, and fuel logs directly linking vehicles to camp managers.',
      bullets: [
        'Live fuel monitoring integrations',
        'Instant messaging between cars',
      ],
    },
    {
      id: 5,
      icon: CalendarDays,
      iconBg: '#3D6B56',
      accentColor: '#3D6B56',
      eyebrow: 'REVENUE PIPELINE',
      title: 'High-Conversion Booking Suite',
      body: 'Sleek luxury reservation flow allowing travel agents to package private flights, lodge selections, and bespoke excursions directly.',
      bullets: [
        'Dynamic agency pricing modifiers',
        'Real-time luxury suite calendars',
      ],
    },
    {
      id: 6,
      icon: ShieldCheck,
      iconBg: '#2C2418',
      accentColor: '#F0E8D8',
      eyebrow: 'MILITARY-GRADE SECURITY',
      title: 'L6 High-Security Logs',
      body: 'Cryptographically secured database auditing all client logs, employee interactions, and guest lists with instant verification protocols.',
      bullets: [
        'Zero-trust user permission layers',
        'Unalterable cryptographic audit ledgers',
      ],
    },
  ];

  useEffect(() => {
    const grid = gridContainerRef.current;
    if (!grid) return;

    // Reveal all cards with clean ScrollTrigger stagger
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            grid.querySelectorAll('.feature-card'),
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
            }
          );
        },
      });
    });
  }, []);

  return (
    <section id="features" className="py-24 md:py-32 px-6 md:px-12 bg-bg-base relative z-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-mono font-medium block mb-4">
            Platform Capabilities
          </span>
          <SplitHeading
            text="Forged for the Wild, | Engineered for Enterprise Operations."
            as="h2"
            type="lines"
            className="text-3xl md:text-5xl font-serif tracking-tight font-medium text-cream leading-tight"
          />
        </div>

        {/* 3x2 Cards Grid */}
        <div
          ref={gridContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuresList.map((card, idx) => (
            <FeatureCard key={card.id} card={card} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
};
export default Features;
