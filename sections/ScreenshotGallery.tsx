'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileImage, 
  Terminal, 
  Cpu, 
  Radio, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface MockupPreset {
  id: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  details: string[];
}

export const ScreenshotGallery = () => {
  const [activeTab, setActiveTab] = useState<string>('sos');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets: MockupPreset[] = [
    {
      id: 'sos',
      name: 'SOS Dispatch Command',
      badge: 'REAL-TIME OUTPOSTS MESH',
      title: 'Satellite SOS Dispatch Console',
      description: 'The administrative command station linking ranger vehicles, remote flight charters, and regional bases with an un-jammable satellite mesh.',
      details: [
        'Active satellite telemetry loops with zero-latency synchronization',
        'Outpost coordination maps displaying localized ranger squads',
        'One-click priority audio channel triggers for instant dispatching'
      ]
    },
    {
      id: 'watchdog',
      name: 'Operations Watchdog',
      badge: 'VEHICLE MECHANICS & TELEMETRY',
      title: 'Camp Operations Supervisor',
      description: 'A centralized operational health dashboard offering complete oversight of cruiser mechanical performance, geofence compliance, and guide checklists.',
      details: [
        'Radiator stress and tire diagnostics indicators with instant alarms',
        'Dynamic speed limits compliance trackers mapped against local terrain',
        'Automated guide wildlife logs compiled in interactive migration logs'
      ]
    },
    {
      id: 'booking',
      name: 'Reservations Engine',
      badge: 'LUXURY ALLOCATION SUITE',
      title: 'Bespoke Booking Pipeline',
      description: 'The definitive reservations ledger empowering camp staff and high-end boutique travel agencies to secure rooms, luxury cars, and charter flights.',
      details: [
        'Dynamic, season-aware high-occupancy room allocation charts',
        'Integrated flight sheets syncing directly with private charter pilots',
        'Cryptographically signed travel agent workspaces and commissions ledger'
      ]
    }
  ];

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setUploadError(null);
    
    // Strict runtime validations
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please upload PNG, JPG, JPEG, or WEBP images.');
      return;
    }
    
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSizeBytes) {
      setUploadError('File size exceeds the 5MB limit. Please upload a smaller screenshot.');
      return;
    }

    // Process file as Data URL
    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsSimulatingLoad(true);
      setUploadProgress(0);
      
      // Simulate highly-polished loading progress ticker
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          setUploadProgress(100);
          clearInterval(progressInterval);
        } else {
          setUploadProgress(currentProgress);
        }
      }, 100);
    };

    reader.onloadend = () => {
      setTimeout(() => {
        setUploadedImage(reader.result as string);
        setIsSimulatingLoad(false);
      }, 1000); // Aesthetic pause for processing representation
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setUploadError(null);
    setUploadProgress(0);
  };

  const currentPreset = presets.find(p => p.id === activeTab);

  return (
    <section id="screenshot-sandbox" className="py-24 md:py-32 px-6 md:px-12 bg-bg-base relative border-t border-border-warm z-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-mono font-medium block mb-4">
            System Sandbox & Showcase
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-cream mb-4 max-w-3xl">
            Experience the Administrative Console
          </h2>
          <p className="text-sm md:text-base font-sans text-cream-muted font-light leading-relaxed max-w-3xl">
            Toggle between our core real-time operational presets below, or **sandbox-test your own custom layout** by dropping a screenshot directly into our luxury device frame simulator.
          </p>
        </div>

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Controls & Details */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            
            {/* Tab Selection Row */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-bg-surface border border-border-warm rounded-lg">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActiveTab(preset.id);
                    setUploadError(null);
                  }}
                  className={`px-4 py-2.5 rounded-[6px] text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                    activeTab === preset.id
                      ? 'bg-gold text-cream shadow-lg shadow-gold/10'
                      : 'text-cream-muted hover:text-cream hover:bg-bg-lift/40'
                  }`}
                >
                  {preset.name.split(' ')[0]}
                </button>
              ))}
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-4 py-2.5 rounded-[6px] text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                  activeTab === 'custom'
                    ? 'bg-gold text-cream shadow-lg shadow-gold/10'
                    : 'text-cream-muted hover:text-cream hover:bg-bg-lift/40'
                }`}
              >
                Custom Sandbox
              </button>
            </div>

            {/* Dynamic Content Panel */}
            <div className="min-h-[260px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab !== 'custom' && currentPreset ? (
                  <motion.div
                    key={currentPreset.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] tracking-[0.2em] font-mono text-gold font-semibold uppercase">
                        {currentPreset.badge}
                      </span>
                      <h3 className="text-2xl font-serif text-cream font-medium mt-1.5">
                        {currentPreset.title}
                      </h3>
                    </div>
                    
                    <p className="text-xs md:text-sm text-cream-muted font-light font-sans leading-relaxed">
                      {currentPreset.description}
                    </p>

                    <ul className="space-y-3.5 pt-2">
                      {currentPreset.details.map((detail, index) => (
                        <li key={index} className="flex items-start space-x-3 text-xs text-cream/90 font-sans font-light">
                          <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="custom-upload"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] tracking-[0.2em] font-mono text-gold font-semibold uppercase">
                        LIVE SANDBOX SIMULATOR
                      </span>
                      <h3 className="text-2xl font-serif text-cream font-medium mt-1.5">
                        Upload Console Layout
                      </h3>
                    </div>

                    <p className="text-xs md:text-sm text-cream-muted font-light font-sans leading-relaxed">
                      Verify how your custom system designs, custom reservation flows, or telemetry analytics fit into the Axelo luxury framework. Files are rendered client-side instantly.
                    </p>

                    {/* Interactive Drop / Upload Zone */}
                    {!uploadedImage && !isSimulatingLoad ? (
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                          dragActive 
                            ? 'border-gold bg-gold/5 shadow-2xl shadow-gold/5 scale-[1.02]' 
                            : 'border-border-warm hover:border-gold/40 hover:bg-bg-surface bg-bg-surface/30'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleFileInput}
                        />
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-border-accent flex items-center justify-center mb-4 text-gold">
                          <UploadCloud className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="text-xs font-mono text-cream font-medium tracking-wide block mb-1">
                          Drag & Drop System Screenshot
                        </span>
                        <span className="text-[10px] font-sans text-cream-muted font-light block mb-4">
                          or click to browse local folders
                        </span>
                        <span className="text-[9px] font-mono text-cream-ghost border border-border-warm px-2 py-0.5 rounded uppercase">
                          PNG, JPG, WEBP · MAX 5MB
                        </span>
                      </div>
                    ) : isSimulatingLoad ? (
                      <div className="border border-border-warm rounded-xl p-8 flex flex-col items-center justify-center bg-bg-surface/30 min-h-[220px]">
                        <RefreshCw className="w-8 h-8 text-gold animate-spin mb-4" />
                        <span className="text-xs font-mono text-cream font-medium mb-2 uppercase tracking-widest">
                          Cryptographic Parsing
                        </span>
                        <div className="w-full max-w-xs bg-border-warm h-1 rounded-full overflow-hidden relative">
                          <motion.div 
                            className="bg-gold h-full rounded-full" 
                            initial={{ width: '0%' }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ ease: 'easeInOut' }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-cream-ghost mt-2">
                          {uploadProgress}% INDEXED
                        </span>
                      </div>
                    ) : (
                      <div className="border border-gold/30 rounded-xl p-6 bg-bg-surface/50 border border-border-warm flex flex-col space-y-4">
                        <div className="flex items-center justify-between border-b border-border-warm pb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-green/10 border border-green/30 flex items-center justify-center text-green">
                              <FileImage className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-mono text-cream font-medium block">Screenshot Loaded</span>
                              <span className="text-[10px] font-sans text-green font-semibold">Parity Synced Client-Side</span>
                            </div>
                          </div>
                          <button
                            onClick={clearUploadedImage}
                            className="text-[10px] font-mono text-danger font-bold hover:bg-danger/15 border border-danger/30 rounded px-2.5 py-1 uppercase transition-all duration-300"
                          >
                            Reset Custom View
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-cream-muted">
                          <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                          <span>Local safety checks validated without server storage.</span>
                        </div>
                      </div>
                    )}

                    {/* Runtime error alerts */}
                    {uploadError && (
                      <div className="border border-danger/30 bg-danger/10 text-danger rounded-lg p-3 flex items-start space-x-2.5 text-xs font-sans">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT COLUMN: Glassmorphic Device Simulator */}
          <div className="lg:col-span-7 w-full flex justify-center">
            
            {/* Widescreen Monitor Frame Wrapper */}
            <div className="relative w-full max-w-2xl bg-bg-surface/80 rounded-2xl border border-border-warm shadow-2xl p-3 md:p-4 overflow-hidden select-none">
              
              {/* Top Status Bar Controls */}
              <div className="flex items-center justify-between border-b border-border-warm/60 pb-3.5 mb-3.5 px-1 md:px-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green" />
                  <span className="text-[9px] font-mono text-cream-ghost tracking-widest pl-2">CONSOLE LINK: ACT-1402</span>
                </div>
                <div className="flex items-center space-x-4 text-[9px] font-mono text-cream-ghost">
                  <span className="hidden sm:inline">SAT-GRID: 99.8% UPTIME</span>
                  <span className="bg-border-warm px-1.5 py-0.5 rounded text-gold">VIP ENCRYPT: SH-256</span>
                </div>
              </div>

              {/* Dynamic Telemetry Display Pane */}
              <div className="relative w-full aspect-[16/10] bg-bg-base/90 rounded-lg border border-border-warm/60 overflow-hidden flex items-center justify-center">
                
                {/* Glossy Reflective Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cream/3 to-transparent pointer-events-none z-30" />
                
                {/* Laser Scanning Telemetry Line */}
                <div className="absolute left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-40 z-20 animate-[scan-line_4s_ease-in-out_infinite]" />

                <AnimatePresence mode="wait">
                  {/* Preset 1: SOS Outpost Mesh */}
                  {activeTab === 'sos' && (
                    <motion.div
                      key="sos-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-between p-5 md:p-6"
                    >
                      <div className="flex items-center justify-between border-b border-border-warm/30 pb-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Radio className="w-4 h-4 text-danger animate-pulse" />
                          <span className="text-[10px] font-mono font-bold text-danger uppercase tracking-wider">ACTIVE EMERGENCY RESPONSE</span>
                        </div>
                        <span className="text-[9px] font-mono text-cream-ghost">SECTOR-4 SERENGETI GRID</span>
                      </div>
                      
                      {/* Interactive Radar Visual */}
                      <div className="flex-grow relative flex flex-col justify-center items-center overflow-hidden bg-bg-surface/30 rounded border border-border-warm/20 p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(#2c2418_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-40" />
                        <div className="w-24 h-24 rounded-full border border-danger/20 flex items-center justify-center animate-[ping_3s_infinite]">
                          <div className="w-12 h-12 rounded-full border border-danger/40 flex items-center justify-center">
                            <Radio className="w-5 h-5 text-danger" />
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-cream bg-danger/15 border border-danger/30 rounded px-2.5 py-1 text-center max-w-xs mt-4">
                          Ranger Outpost #03 Dispatch Approved
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4 text-[9px] font-mono">
                        <div className="bg-bg-surface p-2.5 border border-border-warm rounded">
                          <div className="text-cream-ghost mb-0.5">ESTIMATED LATENCY</div>
                          <div className="text-danger font-bold">0.02 SECONDS (OUTDOOR)</div>
                        </div>
                        <div className="bg-bg-surface p-2.5 border border-border-warm rounded">
                          <div className="text-cream-ghost mb-0.5">SQUAD telemetry</div>
                          <div className="text-cream font-bold">4 DISPATCHED · 2 REMOTE BACKUP</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Preset 2: Operations Watchdog */}
                  {activeTab === 'watchdog' && (
                    <motion.div
                      key="watchdog-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-between p-5 md:p-6"
                    >
                      <div className="flex items-center justify-between border-b border-border-warm/30 pb-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-gold" />
                          <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">VEHICLE TELEMETRY CENTRAL</span>
                        </div>
                        <span className="text-[9px] font-mono text-cream-ghost">14 ENROUTE CRUISERS SYNCHRONIZED</span>
                      </div>

                      {/* Map Path Layout */}
                      <div className="flex-grow relative flex flex-col justify-center bg-bg-surface/30 rounded border border-border-warm/20 p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(#2c2418_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20" />
                        <svg className="w-full h-24 stroke-gold/25 stroke-[1.5] fill-none">
                          <path d="M20,70 L140,20 C180,60 210,10 280,80 L380,20" strokeDasharray="3 3" />
                          <circle cx="210" cy="30" r="5.5" fill="#E8A84E" className="animate-pulse" />
                          <circle cx="210" cy="30" r="3" fill="#E8A84E" />
                          <text x="225" y="34" fill="#F0E8D8" fontSize="8" fontFamily="monospace" fontWeight="bold">CRUISER #09</text>
                        </svg>
                        <span className="text-[9px] font-mono text-cream-muted text-center mt-3 uppercase">
                          Compliance rating: 97.4% · Speed geofence tracking active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4 text-[9px] font-mono">
                        <div className="bg-bg-surface p-2.5 border border-border-warm rounded">
                          <div className="text-cream-ghost mb-0.5">MECHANICAL WARNINGS</div>
                          <div className="text-gold font-bold">1 COMPLIANCE EXCEEDED (CRUISER #04)</div>
                        </div>
                        <div className="bg-bg-surface p-2.5 border border-border-warm rounded">
                          <div className="text-cream-ghost mb-0.5">OUTPOST GEOFENCE</div>
                          <div className="text-green font-bold">13 VEHICLES COMPLIANT</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Preset 3: Reservations Engine */}
                  {activeTab === 'booking' && (
                    <motion.div
                      key="booking-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-between p-5 md:p-6"
                    >
                      <div className="flex items-center justify-between border-b border-border-warm/30 pb-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-4 h-4 text-green" />
                          <span className="text-[10px] font-mono font-bold text-green uppercase tracking-wider">RESERVATION INVENTORY MONITOR</span>
                        </div>
                        <span className="text-[9px] font-mono text-green font-bold">98.2% CAPACITY HELD</span>
                      </div>

                      <div className="flex-grow flex flex-col justify-between bg-bg-surface/30 rounded border border-border-warm/20 p-4 font-mono text-[9px] text-cream-muted leading-relaxed">
                        <div className="flex items-center justify-between border-b border-border-warm/20 pb-2 mb-2 text-cream font-semibold">
                          <span>SUITE / LODGE IDENTIFIER</span>
                          <span>PERIOD SYNC</span>
                          <span>STATUS</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>#01 KIBO SUITE (AMBOSELI)</span>
                            <span>JUL 22 — JUL 28</span>
                            <span className="text-green font-bold bg-green/10 px-1.5 rounded uppercase">CONFIRMED</span>
                          </div>
                          <div className="flex justify-between border-t border-border-warm/10 pt-1.5">
                            <span>#04 MARA TENT (MASAI MARA)</span>
                            <span>AUG 04 — AUG 12</span>
                            <span className="text-green font-bold bg-green/10 px-1.5 rounded uppercase">CONFIRMED</span>
                          </div>
                          <div className="flex justify-between border-t border-border-warm/10 pt-1.5">
                            <span>#07 SERENGETI VISTA (SERENGETI)</span>
                            <span>SEP 10 — SEP 15</span>
                            <span className="text-gold font-bold bg-gold/15 px-1.5 rounded uppercase">HOLD LOCK</span>
                          </div>
                        </div>
                        <div className="border-t border-border-warm/20 pt-2 text-[8px] text-cream-ghost text-center uppercase">
                          Dynamic commission scaling rules synced for high tier boutiques (+15%)
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4 text-[9px] font-mono">
                        <div className="bg-bg-surface p-2.5 border border-border-warm rounded">
                          <div className="text-cream-ghost mb-0.5">VIP LODGE COUNT</div>
                          <div className="text-cream font-bold">14 ACTIVE SUITES</div>
                        </div>
                        <div className="bg-bg-surface p-2.5 border border-border-warm rounded">
                          <div className="text-cream-ghost mb-0.5">CHARTER FLIGHTS CO-SYNC</div>
                          <div className="text-green font-bold">3 CO-FLIGHTS ACTIVE</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Preset 4: Custom Upload Simulation */}
                  {activeTab === 'custom' && (
                    <motion.div
                      key="custom-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      {uploadedImage ? (
                        <div className="w-full h-full relative">
                          <img
                            src={uploadedImage}
                            alt="Custom System Screenshot"
                            className="w-full h-full object-cover object-top filter contrast-[1.03] saturate-[1.02]"
                          />
                          {/* Live Scan indicator absolute overlay */}
                          <div className="absolute top-3 left-3 bg-gold/90 text-bg-base font-mono text-[8px] font-bold px-2 py-0.5 rounded tracking-widest uppercase shadow-md animate-pulse">
                            LIVE TELEMETRY PROJECTION
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between p-5 md:p-6 text-cream-ghost font-mono">
                          <div className="flex items-center justify-between border-b border-border-warm/30 pb-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <Terminal className="w-4 h-4 text-cream-ghost" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">LIVE CUSTOM SIMULATOR V1</span>
                            </div>
                            <span className="text-[9px] text-danger animate-pulse font-bold">SANDBOX OFFLINE</span>
                          </div>

                          {/* Terminal Wireframe Falling Blocks Visual */}
                          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 border border-dashed border-border-warm rounded bg-bg-surface/10 relative">
                            <div className="absolute inset-0 bg-[radial-gradient(#2c2418_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-10" />
                            <Terminal className="w-12 h-12 text-cream-ghost mb-4 opacity-30 animate-pulse" />
                            <h4 className="text-xs text-cream-muted font-bold tracking-widest uppercase mb-1">
                              Telemetry Vault Standby
                            </h4>
                            <p className="text-[9px] text-cream-ghost max-w-xs font-sans leading-relaxed">
                              Upload a screenshot of your administrator systems, scheduling desks, or analytical workspaces on the left. The live terminal grid will automatically projection-map your frame here.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4 text-[9px]">
                            <div className="bg-bg-surface/40 p-2.5 border border-border-warm/60 rounded">
                              <div className="text-cream-ghost mb-0.5">VAULT PARITY CODE</div>
                              <div className="text-cream-ghost font-bold">SEC-0000 / NOT VALIDATED</div>
                            </div>
                            <div className="bg-bg-surface/40 p-2.5 border border-border-warm/60 rounded">
                              <div className="text-cream-ghost mb-0.5">DECRYPT CHANNEL</div>
                              <div className="text-cream-ghost font-bold">0 SENSORS MOUNTED</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ScreenshotGallery;
