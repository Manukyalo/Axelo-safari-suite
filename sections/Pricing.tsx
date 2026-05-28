'use client';

import React, { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';
import { Check } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { useBooking } from '../lib/context/BookingContext';


const PriceCounter: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const countVal = { val: 0 };

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(countVal, {
            val: value,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: () => {
              if (el) {
                el.innerText = Math.floor(countVal.val).toLocaleString();
              }
            },
          });
        },
      });
    });
  }, [value]);

  return <span ref={ref}>0</span>;
};

export const Pricing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  const tiers = [
    {
      name: 'Starter',
      price: 450000,
      description: 'Ideal for boutique camps managing initial operations.',
      features: [
        'Up to 3 Luxury Lodges',
        'Standard Telemetry Watchdog',
        'Fleet GPS Dashboard',
        'Basic Booking Engine Integration',
        'Standard Email Support',
      ],
      isPopular: false,
    },
    {
      name: 'Professional',
      price: 850000,
      description: 'Built for enterprise operators spanning multiple sectors.',
      features: [
        'Up to 10 Luxury Lodges',
        'Satellite SOS Mesh Integration',
        'Real-time Micro-Climate Radar',
        'Connected Fleet Workspace',
        'Bespoke Dynamic Suite Allocations',
        'Dedicated Operator Hotlines',
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 1850000,
      description: 'Complete zero-trust unalterable operations security.',
      features: [
        'Unlimited Luxury Lodges & Camps',
        'Dedicated Private Satellite Channels',
        'L6 Cryptographic Audit Logs',
        'Instant Multi-Party VIP manifests',
        'Custom Flight Charter API Sync',
        '24/7 Dedicated Ranger Hotlines',
      ],
      isPopular: false,
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.pricing-card');

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          cards.forEach((card, idx) => {
            const isProfessional = card.classList.contains('popular-card');
            
            if (isProfessional) {
              // Scale-in from 0.9 -> 1.02 -> 1 pop effect
              gsap.fromTo(
                card,
                { y: 70, opacity: 0, scale: 0.9 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.8,
                  ease: 'back.out(1.4)',
                  delay: idx * 0.15,
                }
              );
            } else {
              // Starter & Enterprise standard stagger back.out
              gsap.fromTo(
                card,
                { y: 70, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: 'back.out(1.4)',
                  delay: idx * 0.15,
                }
              );
            }

            // Stagger checklist items inside each card
            const listItems = card.querySelectorAll('.checklist-item');
            gsap.fromTo(
              listItems,
              { opacity: 0, x: -10 },
              {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.05,
                delay: idx * 0.15 + 0.3,
              }
            );
          });
        },
      });
    });
  }, []);

  return (
    <section id="pricing" className="py-24 md:py-32 px-6 md:px-12 bg-bg-base relative z-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-mono font-medium block mb-4">
            Pricing Structures
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-cream mb-4">
            Bespoke Enterprise Tiers
          </h2>
          <p className="text-sm md:text-base font-sans text-cream-muted font-light leading-relaxed">
            Choose the operational foundation tailored to your concession area. Honest pricing scaled for luxury East African operations.
          </p>
        </div>

        {/* Pricing Cards Row */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              className={`pricing-card flex flex-col justify-between p-8 rounded-xl bg-bg-surface border relative transition-all duration-300 ease-out select-none ${
                tier.isPopular
                  ? 'popular-card border-gold shadow-2xl shadow-gold/5 lg:scale-105 z-10'
                  : 'border-border-warm hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5'
              }`}
              style={{
                boxShadow: !tier.isPopular ? '0 0 0 0px rgba(196,136,44,0)' : '',
              }}
              onMouseEnter={(e) => {
                if (!tier.isPopular) {
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(196,136,44,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!tier.isPopular) {
                  e.currentTarget.style.boxShadow = '0 0 0 0px rgba(196,136,44,0)';
                }
              }}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 z-20">
                  <span className="bg-gold text-[#412402] font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Header info */}
                <h3 className="text-2xl font-serif font-semibold text-cream mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs font-sans text-cream-muted font-light mb-6 min-h-[32px]">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline space-x-1.5 border-b border-border-warm pb-6 mb-6">
                  <span className="text-xs font-mono font-medium text-gold tracking-widest">KES</span>
                  <span className="text-3xl md:text-4xl font-serif font-bold text-cream tabular-nums">
                    <PriceCounter value={tier.price} />
                  </span>
                  <span className="text-xs font-sans text-cream-muted font-light">/mo</span>
                </div>

                {/* Checklist Features */}
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feat, fidx) => (
                    <li
                      key={fidx}
                      className="checklist-item flex items-start space-x-3 text-xs text-cream/90 font-light opacity-0"
                    >
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="font-sans leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to action */}
              <div className="w-full mt-auto">
                <MagneticButton
                  onClick={openBooking}
                  className={`w-full py-4 rounded-[8px] font-mono text-xs tracking-wider uppercase border transition-colors duration-300 select-none ${
                    tier.isPopular
                      ? 'shimmer-btn bg-gold border-gold text-cream hover:bg-gold-light shadow-lg shadow-gold/10'
                      : 'bg-transparent border-border-warm text-cream hover:bg-cream/5'
                  }`}
                >
                  Acquire Concession License
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default Pricing;
