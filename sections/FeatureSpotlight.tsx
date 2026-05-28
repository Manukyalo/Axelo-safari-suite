'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from '../lib/gsap';
import { TextScramble } from '../components/TextScramble';
import { 
  Radio, 
  MapPin, 
  Activity, 
  Shield, 
  Thermometer, 
  Wind,
  Calendar,
  Users,
  Compass,
  Database
} from 'lucide-react';

interface SpotlightFeature {
  id: string;
  num: string;
  name: string;
  description: string;
  accent: string;
  bullets: string[];
}

export const FeatureSpotlight = () => {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const floatContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const features: SpotlightFeature[] = [
    {
      id: 'sos',
      num: '01',
      name: 'SOS Emergency Network',
      description: 'Zero-latency distress broadcasts connecting luxury custom cruisers directly with dispatchers and ranger bases, functioning flawlessly outside standard cellular boundaries.',
      accent: '#C44830',
      bullets: [
        'Automatic cellular to satellite fallback routing',
        'One-click silent distress broadcasts for drivers',
        'Ranger telemetry and dispatch coordination desk',
      ],
    },
    {
      id: 'watchdog',
      num: '02',
      name: 'Operations Watchdog',
      description: 'A comprehensive camp supervisor console delivering deep telemetry, geofence violations, mechanical safety flags, and real-time operator diagnostics.',
      accent: '#E8A84E',
      bullets: [
        'Custom geofencing boundaries with instant flags',
        'Speed and terrain compliance tracking algorithms',
        'Vehicle mechanical stress and radiator warning indices',
      ],
    },
    {
      id: 'weather',
      num: '03',
      name: 'Weather Intelligence',
      description: 'Lodge-level meteorological forecasting drawing from custom onsite sensors to provide guides with hour-by-hour route planning indices and river crossing safeties.',
      accent: '#3D6B56',
      bullets: [
        'Microclimate precipitation forecasting maps',
        'River level expansion warning triggers',
        'Real-time sun index alerts for game drive plans',
      ],
    },
    {
      id: 'fleet',
      num: '04',
      name: 'Connected Fleet Workspace',
      description: 'The ultimate navigator workspace bridging lodges, workshops, and driving crews together with vehicle-level fuel tracking, digital manifests, and guide logs.',
      accent: '#C4882C',
      bullets: [
        'Connected fuel tank digital sensor streams',
        'Automated guide wildlife logs and migration heatmaps',
        'Real-time driving roster sync across operations',
      ],
    },
    {
      id: 'booking',
      num: '05',
      name: 'Reservation Booking Engine',
      description: 'A luxury reservations platform that empowers operators and boutique agencies to craft multi-destination safaris, charter flights, and lodge assignments.',
      accent: '#5D9B7E',
      bullets: [
        'Dynamic suite allocation algorithms',
        'Bespoke activity planner and private flight sheets',
        'Commission manager and travel agency workspaces',
      ],
    },
    {
      id: 'security',
      num: '06',
      name: 'L6 Enterprise Security',
      description: 'Military-grade access controls protecting high-profile guest manifests, camp logistics, and payments with immutable logs.',
      accent: '#F0E8D8',
      bullets: [
        'Cryptographically signed permission access states',
        'End-to-end data sanitization and strict tokenization',
        'Instant multi-party identity authentication loops',
      ],
    },
  ];

  useEffect(() => {
    const outer = outerWrapperRef.current;
    if (!outer) return;

    // Pin feature track and update index on progress
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: outer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * 6);
          setActiveIndex(Math.min(index, 5));
        },
      });
    });

    // Subtle floating animation on the right panel mockup container
    const floater = floatContainerRef.current;
    if (floater) {
      gsap.to(floater, {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  // Manage mockup cards clip-path wipes when activeIndex changes
  useEffect(() => {
    const rPanel = rightPanelRef.current;
    if (!rPanel) return;

    const cards = rPanel.querySelectorAll('.mockup-card');
    cards.forEach((card, idx) => {
      if (idx === activeIndex) {
        // Wipe in active from left to right
        gsap.to(card, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.6,
          ease: 'power2.out',
        });
      } else if (idx < activeIndex) {
        // Wiped out (exit right)
        gsap.to(card, {
          clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          duration: 0.6,
          ease: 'power2.out',
        });
      } else {
        // Not entered (wait left)
        gsap.to(card, {
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });
  }, [activeIndex]);

  const activeFeature = features[activeIndex];

  return (
    <section
      ref={outerWrapperRef}
      id="spotlight"
      className="relative w-full h-[600vh] bg-bg-base z-20"
    >
      {/* Sticky Inner Panel */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANEL — Text Details */}
        <div
          ref={leftPanelRef}
          className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 md:px-20 py-12 relative border-b md:border-b-0 md:border-r border-border-warm bg-bg-base"
        >
          {/* Giant Faded Serif Background Number */}
          <div className="absolute top-1/2 left-12 md:left-20 -translate-y-1/2 text-[140px] md:text-[220px] font-serif font-semibold text-gold opacity-[0.04] leading-none pointer-events-none select-none select-none transition-all duration-500">
            {activeFeature.num}
          </div>

          <div className="relative z-10 max-w-lg">
            {/* Upper Indicator */}
            <span className="text-[10px] tracking-[0.25em] font-mono font-medium text-gold uppercase block mb-4">
              Module Showcase
            </span>

            {/* Feature Name with Text Scramble on transition */}
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-cream leading-tight mb-4 min-h-[48px]">
              <TextScramble key={`title-${activeIndex}`} text={activeFeature.name} />
            </h2>

            {/* Description */}
            <p className="text-sm text-cream-muted font-light font-sans leading-relaxed mb-6 min-h-[80px]">
              {activeFeature.description}
            </p>

            {/* Bullets checklist */}
            <ul className="space-y-3 mb-8">
              {activeFeature.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs text-cream/90 font-light font-sans">
                  <span 
                    className="w-1.5 h-1.5 rounded-full inline-block shrink-0 mt-1.5"
                    style={{ backgroundColor: activeFeature.accent }}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Progress Count Tracking */}
            <div className="flex items-center space-x-4 border-t border-border-warm pt-4">
              <span className="font-serif text-gold text-lg font-medium">{activeFeature.num}</span>
              <span className="w-8 h-[1px] bg-border-warm" />
              <span className="font-serif text-cream-ghost text-sm">06</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Dashboard Mockups */}
        <div
          ref={rightPanelRef}
          className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center bg-bg-surface p-8 md:p-16 relative"
        >
          {/* Floating Container to contain our 6 dashboard SVGs */}
          <div
            ref={floatContainerRef}
            className="relative w-full max-w-lg aspect-square md:aspect-[4/3] rounded-xl border border-border-warm bg-bg-base/80 shadow-2xl p-6 overflow-hidden"
          >
            {/* Mockup 1: SOS Network */}
            <div 
              className="mockup-card absolute inset-0 w-full h-full bg-bg-base flex flex-col p-6 z-10 select-none pointer-events-none"
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            >
              <div className="flex items-center justify-between border-b border-border-warm pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                  <span className="text-[10px] tracking-widest font-mono text-danger font-bold uppercase">SOS ACTIVE TRACKING</span>
                </div>
                <span className="text-[10px] font-mono text-cream-ghost">SAT-SAT SYNC ACTIVE</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                {/* Radar Grid */}
                <div className="relative flex-grow border border-border-warm/30 rounded-lg flex items-center justify-center overflow-hidden bg-bg-surface">
                  <div className="absolute inset-0 bg-[radial-gradient(#2c2418_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  <div className="w-32 h-32 rounded-full border border-danger/20 flex items-center justify-center animate-[ping_2s_infinite]">
                    <div className="w-16 h-16 rounded-full border border-danger/40 flex items-center justify-center">
                      <Radio className="w-6 h-6 text-danger" />
                    </div>
                  </div>
                  {/* Flashing alert text */}
                  <span className="absolute bottom-3 text-[10px] font-mono text-danger font-semibold bg-danger/10 px-2 py-0.5 rounded">
                    SERENGETI SECTOR 4: DISTRESS SIGNAL MATCHED
                  </span>
                </div>
                {/* Latency statistics */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono">
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">SATELLITE</div>
                    <div className="text-cream font-bold">INMARSAT-5</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">LATENCY</div>
                    <div className="text-danger font-bold">0.08 SEC</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">RANGERS</div>
                    <div className="text-cream font-bold">3 DISPATCHED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 2: Operations Watchdog */}
            <div 
              className="mockup-card absolute inset-0 w-full h-full bg-bg-base flex flex-col p-6 z-10 select-none pointer-events-none"
              style={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
            >
              <div className="flex items-center justify-between border-b border-border-warm pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span className="text-[10px] tracking-widest font-mono text-gold font-bold uppercase">GEOFENCE TRACKING DESK</span>
                </div>
                <span className="text-[10px] font-mono text-cream-ghost">14 OPERATING CRUISERS</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                {/* Geofence Chart Vector */}
                <div className="relative flex-grow border border-border-warm/30 rounded-lg flex flex-col justify-between p-4 overflow-hidden bg-bg-surface">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                    <span className="text-cream-muted">CRUISER #04</span>
                    <span className="text-danger font-semibold bg-danger/10 px-2 py-0.5 rounded">OUTSIDE BOUNDARY</span>
                  </div>
                  <div className="flex-grow flex items-center justify-center relative">
                    {/* SVG map lines */}
                    <svg className="w-full h-24 stroke-gold/20 stroke-2 fill-none">
                      <path d="M10,10 L150,40 L280,10 L350,90 L200,80 L10,80 Z" strokeDasharray="4 4" />
                      <circle cx="200" cy="80" r="5" fill="#C4882C" className="animate-ping" />
                      <circle cx="200" cy="80" r="3" fill="#C4882C" />
                      <circle cx="320" cy="50" r="5" fill="#C44830" className="animate-ping" />
                      <circle cx="320" cy="50" r="3" fill="#C44830" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-cream-ghost">SPEED: 42 KM/H · RADIATOR STRESS: 92% (ALERT)</span>
                </div>
                {/* Performance telemetry */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono">
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">COMPLIANCE</div>
                    <div className="text-gold font-bold">94.2%</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">ALERTS</div>
                    <div className="text-danger font-bold">1 OUT OF ZONE</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">RADIATORS</div>
                    <div className="text-cream font-bold">ALL STABLE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 3: Weather Intelligence */}
            <div 
              className="mockup-card absolute inset-0 w-full h-full bg-bg-base flex flex-col p-6 z-10 select-none pointer-events-none"
              style={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
            >
              <div className="flex items-center justify-between border-b border-border-warm pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green" />
                  <span className="text-[10px] tracking-widest font-mono text-green font-bold uppercase">WEATHER RADAR CONSOLE</span>
                </div>
                <span className="text-[10px] font-mono text-cream-ghost">MARA RIVER BASIN</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                {/* Weather details */}
                <div className="relative flex-grow border border-border-warm/30 rounded-lg flex flex-col justify-between p-4 overflow-hidden bg-bg-surface">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-5 h-5 text-green" />
                      <span className="text-2xl font-serif text-cream font-semibold">28.4°C</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-cream-muted">
                      <Wind className="w-4 h-4 text-green" />
                      <span>12 KM/H NE</span>
                    </div>
                  </div>
                  <div className="flex-grow flex items-center justify-center">
                    {/* Temperature forecast bar chart */}
                    <div className="flex items-end justify-between w-full h-16 px-4">
                      <div className="w-6 bg-green/20 border border-green/40 h-8 rounded-t" />
                      <div className="w-6 bg-green/30 border border-green/50 h-10 rounded-t" />
                      <div className="w-6 bg-green/50 border border-green/70 h-14 rounded-t" />
                      <div className="w-6 bg-green border border-green h-16 rounded-t" />
                      <div className="w-6 bg-green/60 border border-green/80 h-12 rounded-t" />
                      <div className="w-6 bg-green/20 border border-green/40 h-6 rounded-t" />
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-green text-center font-semibold bg-green/10 py-1 rounded">
                    RIVER RISE INDEX: 0.12M (SAFE TO CROSS)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono">
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">HUMIDITY</div>
                    <div className="text-green font-bold">54%</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">PRECIPIT</div>
                    <div className="text-green font-bold">0.05 MM</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">UV INDEX</div>
                    <div className="text-cream font-bold">9 (EXTREME)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 4: Fleet Workspace */}
            <div 
              className="mockup-card absolute inset-0 w-full h-full bg-bg-base flex flex-col p-6 z-10 select-none pointer-events-none"
              style={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
            >
              <div className="flex items-center justify-between border-b border-border-warm pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-gold" />
                  <span className="text-[10px] tracking-widest font-mono text-gold font-bold uppercase">FLEET GPS COMMAND</span>
                </div>
                <span className="text-[10px] font-mono text-cream-ghost">12 SAT CONNECTIONS</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                {/* Fleet workspace visual map layout */}
                <div className="relative flex-grow border border-border-warm/30 rounded-lg flex flex-col justify-between p-4 overflow-hidden bg-bg-surface">
                  <div className="flex-grow flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#2c2418_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                    <svg className="w-full h-24 stroke-gold/20 fill-none">
                      <path d="M50,80 C100,20 180,120 220,10 C280,60 320,10 380,80" strokeWidth="1.5" />
                      <circle cx="180" cy="75" r="5" fill="#C4882C" className="animate-pulse" />
                      <circle cx="180" cy="75" r="2.5" fill="#C4882C" />
                      <text x="195" y="78" fill="#F0E8D8" fontSize="8" fontFamily="monospace">CRUISER #07</text>
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-cream-ghost text-center block">
                    ACTIVE ROUTE: LODGE TO TAIL MIGRATION crossing in 14 mins
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono">
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">FLEET TOTAL</div>
                    <div className="text-gold font-bold">14 CARS</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">ACTIVE COMS</div>
                    <div className="text-gold font-bold">12 DRIVERS</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">FUEL USAGE</div>
                    <div className="text-cream font-bold">78% AVG</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 5: Booking Engine */}
            <div 
              className="mockup-card absolute inset-0 w-full h-full bg-bg-base flex flex-col p-6 z-10 select-none pointer-events-none"
              style={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
            >
              <div className="flex items-center justify-between border-b border-border-warm pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green" />
                  <span className="text-[10px] tracking-widest font-mono text-green font-bold uppercase">SUITE INVENTORY PIPELINE</span>
                </div>
                <span className="text-[10px] font-mono text-cream-ghost">98% SEASONS LOAD</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                {/* Luxury Booking UI layout mockup */}
                <div className="relative flex-grow border border-border-warm/30 rounded-lg flex flex-col justify-between p-4 overflow-hidden bg-bg-surface">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-cream font-semibold font-serif">KIBO SUITE (AMBOSELI)</span>
                    <span className="text-green font-bold uppercase bg-green/10 px-2 py-0.5 rounded">CONFIRMED</span>
                  </div>
                  <div className="my-2 border-y border-border-warm/40 py-2 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-green" />
                      <span>2 GUESTS (VIP)</span>
                    </div>
                    <span>JUL 22 — JUL 28</span>
                  </div>
                  <div className="text-[9px] font-mono text-cream-muted leading-relaxed">
                    AGENT: Private Wilderness Excursions Ltd.<br />
                    RATE SCALE: Dynamic seasonal high tier (+15% markup)
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono">
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">REVENUE</div>
                    <div className="text-green font-bold">12,400 USD</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">AGENTS SYNCED</div>
                    <div className="text-green font-bold">42 BOUTIQUES</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">OCCUPANCY</div>
                    <div className="text-cream font-bold">96.8%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 6: L6 Security */}
            <div 
              className="mockup-card absolute inset-0 w-full h-full bg-bg-base flex flex-col p-6 z-10 select-none pointer-events-none"
              style={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
            >
              <div className="flex items-center justify-between border-b border-border-warm pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-cream-ghost" />
                  <span className="text-[10px] tracking-widest font-mono text-cream-ghost font-bold uppercase">IMMUTABLE SECURITY AUDIT LOG</span>
                </div>
                <span className="text-[10px] font-mono text-green">L6 SECURED</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                {/* Cryptographic Log Stream layout mockup */}
                <div className="relative flex-grow border border-border-warm/30 rounded-lg flex flex-col justify-between p-3 overflow-hidden bg-bg-surface font-mono text-[9px] leading-tight text-cream-muted">
                  <div className="flex items-center space-x-1.5 text-green mb-1.5">
                    <Database className="w-3 h-3" />
                    <span>VERIFIED CRYPTOGRAPHIC BLOCK #142,504</span>
                  </div>
                  <div className="space-y-1">
                    <div>[11:34:02] LOG: API key access verified for lodge_amboseli_main</div>
                    <div>[11:34:25] REQ: GET /guest_manifest_vip - Status: 200 (Success)</div>
                    <div>[11:35:10] SIGN: Block hash: f88a24c...cc15 verified</div>
                    <div className="text-cream font-semibold">[11:36:12] LOCK: System parity check 100% integral</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono">
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">ENCRYPTION</div>
                    <div className="text-cream font-bold">SHA-256</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">TAMPER CHECK</div>
                    <div className="text-green font-bold">0 RISK DETECTED</div>
                  </div>
                  <div className="bg-bg-surface p-2 border border-border-warm rounded">
                    <div className="text-cream-ghost mb-0.5">COMPLIANCE</div>
                    <div className="text-cream font-bold">ISO-27001</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
export default FeatureSpotlight;
