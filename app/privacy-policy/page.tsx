import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Nav and Footer to prevent SSR conflicts (same pattern as main page)
const Nav = dynamic(() => import('@/components/Nav'), { ssr: false });
const Footer = dynamic(() => import('@/sections/Footer'), { ssr: false });

export const metadata = {
  title: 'Privacy Protocol — Axelo Safari Suite',
  description: 'Axelo operational telemetry encryption, SOS network satellite routing, and guest profile privacy regulations.',
};

export default function PrivacyPolicy() {
  const policySections = [
    {
      num: '01',
      tag: 'TELEMETRY & FLEET LOGS',
      title: 'Vehicle Diagnostic Data Ingestion',
      description: 'Axelo monitors mechanical telemetry (RPM, shock fatigue, radiator thermal cycles, geofence check-ins) and passenger manifest counts strictly for operational integrity. This telemetry payload is processed client-side or transmitted via encrypted SAT-mesh nodes only when vehicles are active.',
    },
    {
      num: '02',
      tag: 'SOS MESH & GEOLOCATION',
      title: 'Satellite Emergency Comms Routing',
      description: 'RF mesh ping timers, emergency satellite audio feeds, and geolocated ranger coordinates are logged continuously in emergency status. In compliance with international wilderness safety frameworks, SOS beacons bypass secondary servers and route directly to ranger outpost terminal queues.',
    },
    {
      num: '03',
      tag: 'RESERVATIONS & VISAS',
      title: 'Lodge Allocation & Commission Logs',
      description: 'Lodge reservation grids, commission commissions, and private flight logs process guest identifiers (names, passport numbers, pilot flight logs) solely for secure authorization checks. Booking details are secured in local databases with strict administrative access control policies.',
    },
    {
      num: '04',
      tag: 'SECURITY & RLS COMPLIANCE',
      title: 'SHA-256 Audit Trail & Ledger Logging',
      description: 'All system overrides, dispatch priorities, and administrative actions are logged in a write-once, read-many cryptographic ledger. Access overrides require Ranger-level digital tokens, ensuring full accountability under our concession audit registry.',
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
            Security & Operations Governance
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-cream mb-4">
            Privacy Protocol
          </h1>
          <p className="text-sm md:text-base text-cream-muted font-light leading-relaxed max-w-2xl">
            This document outlines the rigorous cryptographic handling, satellite data transit regulations, and operational bounds governing telemetry, emergency signals, and guest manifests within the Axelo Suite.
          </p>
        </div>

        {/* Policy Grid Sections */}
        <div className="space-y-10">
          {policySections.map((sec, index) => (
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

        {/* Regulatory Alert Box */}
        <div className="mt-12 bg-gold/5 border border-gold/20 p-6 rounded-xl space-y-3">
          <h3 className="text-xs font-mono text-gold font-bold tracking-wider uppercase">
            REGULATORY CONFORMANCE & STANDARDS
          </h3>
          <p className="text-xs text-cream-muted font-sans font-light leading-relaxed">
            Axelo operations conform to regional East African National Park wildlife telemetry guidelines, international marine & wilderness emergency communications treaties, and premium guest digital transaction safety protocols. All data queries are protected by Row-Level Security (RLS) policies at the concession data store layer.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
