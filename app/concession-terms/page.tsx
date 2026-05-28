import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Nav and Footer to prevent SSR conflicts (same pattern as main page)
const Nav = dynamic(() => import('@/components/Nav'), { ssr: false });
const Footer = dynamic(() => import('@/sections/Footer'), { ssr: false });

export const metadata = {
  title: 'Concession Terms — Axelo Safari Suite',
  description: 'Axelo operational licensing guidelines, seasonal concession limits, and wilderness safety agreement policies.',
};

export default function ConcessionTerms() {
  const termsSections = [
    {
      num: '01',
      tag: 'SEASONAL LICENSING',
      title: 'Operational Licenses & Room Grid Allocations',
      description: 'Axelo Safari Suite licenses are issued per lodge concession. Active reservations, guide matchmaking systems, and private charter flight scheduling must align with seasonal occupancy quotas. Commisions and agency fee calculations are locked dynamically to protect financial transaction safety.',
    },
    {
      num: '02',
      tag: 'SAFETY & GEOFENCES',
      title: 'Wilderness Range Compliance & Diagnostics',
      description: 'Operators are required to keep vehicle speed monitoring active inside national geofenced parks. Wildlife concession sightings, conservation patrol checklists, and telemetry diagnostic sensors must remain operational to support anti-poaching ranger dispatches and outpost signal relays.',
    },
    {
      num: '03',
      tag: 'SAT-COMMS UPTIME',
      title: 'Satellite SOS Mesh Availability & SLA',
      description: 'Emergency RF mesh communications, ranger voice streams, and search-rescue triangulation grids are target-configured for 99.8% network availability. Priority SOS signals override secondary data telemetry and concession updates instantly under emergency situations.',
    },
    {
      num: '04',
      tag: 'SYSTEM MUTATION',
      title: 'Audit Logging & Ledger Transactions',
      description: 'System actions, database updates, and ranger override authorizations are logged in our secure transaction database. Operations logs are non-reversible and cryptographically hashed, guaranteeing full security audit integrity for luxury concession managers.',
    },
  ];

  return (
    <div className="bg-bg-base text-cream min-h-screen flex flex-col font-sans">
      <Nav />

      {/* Main Container */}
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 relative z-10 max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-16 border-b border-border-warm pb-10">
          <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-mono font-semibold block mb-4">
            Wilderness Concession Framework
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-cream mb-4">
            Concession Terms
          </h1>
          <p className="text-sm md:text-base text-cream-muted font-light leading-relaxed max-w-2xl">
            These terms define the operational requirements, Wilderness range geofencing laws, and emergency satellite SLA guidelines governing active subscriptions of the Axelo Safari Suite.
          </p>
        </div>

        {/* Terms Grid Sections */}
        <div className="space-y-10">
          {termsSections.map((sec, index) => (
            <div 
              key={index} 
              className="bg-bg-surface/50 border border-border-warm/60 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start transition-all duration-300 hover:border-gold/30 hover:bg-bg-surface"
            >
              {/* Number and Tag */}
              <div className="shrink-0 flex md:flex-col items-center md:items-start gap-3 md:gap-1.5 md:w-32">
                <span className="text-2xl font-serif text-gold italic font-bold">
                  {sec.num}
                </span>
                <span className="text-[8px] font-mono text-cream-ghost tracking-widest uppercase border border-border-warm/80 px-2 py-0.5 rounded">
                  {sec.tag}
                </span>
              </div>

              {/* Text Block */}
              <div className="space-y-2">
                <h2 className="text-lg md:text-xl font-serif text-cream font-medium">
                  {sec.title}
                </h2>
                <p className="text-xs md:text-sm text-cream-muted font-light leading-relaxed">
                  {sec.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 bg-gold/5 border border-gold/20 p-6 rounded-xl space-y-3">
          <h3 className="text-xs font-mono text-gold font-bold tracking-wider uppercase">
            OPERATING RESPONSIBILITIES & JURISDICTION
          </h3>
          <p className="text-xs text-cream-muted font-sans font-light leading-relaxed">
            By activating an Axelo Safari Suite license, the operator agrees to conform to the geofence guidelines set forth by local park authorities (e.g. TANAPA, KWS) and respects wilderness conservation limits. Axelo Technologies reserves the right to suspend accounts routing invalid SOS beacons or violating local wildlife concession guidelines.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
