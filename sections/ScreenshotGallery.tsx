'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from '../lib/gsap';
import { 
  UploadCloud, 
  FileImage, 
  Terminal, 
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ScreenshotPreset {
  id: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  imagePath: string;
  details: string[];
}

export const ScreenshotGallery = () => {
  const [activeTab, setActiveTab] = useState<string>('fleet-telemetry');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);

  // Framer Motion 3D Tilt values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 30, stiffness: 150, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);

  // GSAP Parallax on scroll
  useEffect(() => {
    const monitorEl = monitorRef.current;
    if (!monitorEl) return;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.fromTo(
        monitorEl,
        { y: 60 },
        {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    });
  }, []);

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  const presets: ScreenshotPreset[] = [
    {
      id: 'fleet-telemetry',
      name: 'Fleet Telemetry',
      badge: 'VEHICLE DIAGNOSTICS & TRACKING',
      title: 'Fleet Watchdog Telemetry Grid',
      description: 'Real-time telemetry overlay tracking vehicle mechanical stress, speeds, geofence compliance, and passenger occupancy indices across all active safaris.',
      imagePath: '/Gallery/live tracking.png',
      details: [
        'Live engine RPM, oil pressure, and cooling diagnostics loop',
        'Automatic speed limiter breach alerts synced with local rangers',
        'Passenger manifest checkins linked with digital guest visa profiles'
      ]
    },
    {
      id: 'fleet-personnel',
      name: 'Fleet Personnel',
      badge: 'TACTICAL DISPATCH & STAFF',
      title: 'Operations Fleet Personnel Dispatch',
      description: 'Real-time coordination panel managing deep-bush rangers, physical regional outposts, and on-site support personnel with redundant communication links.',
      imagePath: '/Gallery/Fleet personel.png',
      details: [
        'Real-time tracking of field personnel location and deployment status',
        'Seamless dispatch coordination for rangers and local outposts',
        'Encrypted satellite-linked ranger communication grids'
      ]
    },
    {
      id: 'lodge-booking',
      name: 'Lodge Booking',
      badge: 'RESERVATIONS LEDGER SUITE',
      title: 'Lodge Occupancy Allocator',
      description: 'An executive occupancy ledger allowing reservations managers to instantly allocate luxury tents, match guest profiles with guides, and sync private airport pick-ups.',
      imagePath: '/Gallery/Screenshot 2026-05-28 121047.png',
      details: [
        'Season-aware high-occupancy room grid locking with validation',
        'Integrated charter flight logs detailing arrival times and pilots',
        'Bespoke agent commission payout ledgers with secure API sync'
      ]
    },
    {
      id: 'sos-mesh',
      name: 'SOS Mesh',
      badge: 'OUTPOST COMMUNICATIONS',
      title: 'SOS Mesh Signal Controller',
      description: 'Low-latency RF mesh configuration tool providing ranger squads with un-jammable satellite audio channels and emergency beacons.',
      imagePath: '/Gallery/Screenshot 2026-05-28 121108.png',
      details: [
        'Regional RF repeater mesh configuration loops with ping timers',
        'Encrypted Ranger squad communication channel allocation',
        'Priority SOS broadcast toggles overrides all passive data channels'
      ]
    },
    {
      id: 'guide-concession',
      name: 'Guide Concession',
      badge: 'WILDLIFE RECORDING & LOGS',
      title: 'Guide Concession Intelligence',
      description: 'Field guide migration ledger compiling game drive sightings, local wildlife encounters, conservation patrol logs, and ecological observation trends.',
      imagePath: '/Gallery/Screenshot 2026-05-28 121117.png',
      details: [
        'Real-time animal migration mapping utilizing guide sightings',
        'Anti-poaching patrol logs synced with regional conservation headquarters',
        'Guest game drive checklists and custom feedback ratings'
      ]
    }
  ];


  // Sync index on active tab change
  const currentPresetIndex = presets.findIndex(p => p.id === activeTab);

  const openLightbox = () => {
    if (activeTab === 'custom' && !uploadedImage) return;
    
    if (activeTab === 'custom') {
      setLightboxIndex(-1);
    } else {
      setLightboxIndex(currentPresetIndex);
    }
    setIsLightboxOpen(true);
  };

  const handlePrevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === -1) return;
    setLightboxIndex(prev => (prev === 0 ? presets.length - 1 : prev - 1));
  };

  const handleNextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === -1) return;
    setLightboxIndex(prev => (prev === presets.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevLightbox();
      if (e.key === 'ArrowRight') handleNextLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, lightboxIndex]);

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
    
    // Strict runtime validations (Rule 2)
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
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          setUploadProgress(100);
          clearInterval(progressInterval);
        } else {
          setUploadProgress(currentProgress);
        }
      }, 80);
    };

    reader.onloadend = () => {
      setTimeout(() => {
        setUploadedImage(reader.result as string);
        setIsSimulatingLoad(false);
      }, 600); 
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
    <section 
      ref={sectionRef}
      onMouseMove={handleGlobalMouseMove}
      id="screenshot-sandbox" 
      className="py-24 md:py-32 px-6 md:px-12 bg-bg-base relative border-t border-border-warm z-20 overflow-hidden perspective-[2000px]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-mono font-medium block mb-4">
            System Sandbox & Showcase
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-cream mb-4 max-w-3xl">
            Live Administrative Console
          </h2>
          <p className="text-sm md:text-base font-sans text-cream-muted font-light leading-relaxed max-w-3xl">
            Review screenshots of our core operating modules deployed on site, or **sandbox-test your own UI layouts** by dropping a screenshot directly into our widescreen terminal simulator.
          </p>
        </div>

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Controls & Details */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Grid selector of presets */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-2">Select Operations Module View</label>
              
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-bg-surface border border-border-warm rounded-xl">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActiveTab(preset.id);
                      setUploadError(null);
                    }}
                    className={`px-2 py-3 rounded-[6px] text-[10px] font-mono tracking-wider uppercase transition-all duration-300 flex flex-col items-center justify-center text-center space-y-1 ${
                      activeTab === preset.id
                        ? 'bg-gold text-cream shadow-lg shadow-gold/10'
                        : 'text-cream-muted hover:text-cream hover:bg-bg-lift/40'
                    }`}
                  >
                    <span>{preset.name}</span>
                  </button>
                ))}
                
                {/* Sandbox selector */}
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-2 py-3 rounded-[6px] text-[10px] font-mono tracking-wider uppercase transition-all duration-300 flex flex-col items-center justify-center text-center space-y-1 ${
                    activeTab === 'custom'
                      ? 'bg-gold text-cream shadow-lg shadow-gold/10'
                      : 'text-cream-muted hover:text-cream border border-dashed border-border-warm hover:border-gold/30 hover:bg-bg-lift/40'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                  <span>Sandbox Live</span>
                </button>
              </div>
            </div>

            {/* Dynamic Content Panel */}
            <div className="min-h-[220px] flex flex-col justify-between bg-bg-surface/30 border border-border-warm/40 p-6 rounded-xl">
              <AnimatePresence mode="wait">
                {activeTab !== 'custom' && currentPreset ? (
                  <motion.div
                    key={currentPreset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[9px] tracking-[0.2em] font-mono text-gold font-semibold uppercase block">
                        {currentPreset.badge}
                      </span>
                      <h3 className="text-xl font-serif text-cream font-medium mt-1">
                        {currentPreset.title}
                      </h3>
                    </div>
                    
                    <p className="text-xs text-cream-muted font-light font-sans leading-relaxed">
                      {currentPreset.description}
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-border-warm/50">
                      {currentPreset.details.map((detail, index) => (
                        <li key={index} className="flex items-start space-x-2.5 text-xs text-cream/90 font-sans font-light">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="custom-upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[9px] tracking-[0.2em] font-mono text-gold font-semibold uppercase block">
                        LIVE SANDBOX SIMULATOR
                      </span>
                      <h3 className="text-xl font-serif text-cream font-medium mt-1">
                        Upload Custom Wireframe
                      </h3>
                    </div>

                    <p className="text-xs text-cream-muted font-light font-sans leading-relaxed">
                      Evaluate custom design prototypes, fleet logs, or custom calendars in context. Files are read client-side and projected in the device monitor frame.
                    </p>

                    {/* Interactive Drop / Upload Zone */}
                    {!uploadedImage && !isSimulatingLoad ? (
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                        className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                          dragActive 
                            ? 'border-gold bg-gold/5 scale-[1.01]' 
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
                        <div className="w-10 h-10 rounded-full bg-gold/10 border border-border-accent flex items-center justify-center mb-3 text-gold">
                          <UploadCloud className="w-5 h-5 animate-pulse" />
                        </div>
                        <span className="text-xs font-mono text-cream font-medium tracking-wide block mb-1">
                          Drag & Drop Screenshot
                        </span>
                        <span className="text-[10px] font-sans text-cream-muted font-light block mb-3">
                          or click to browse local files
                        </span>
                        <span className="text-[8px] font-mono text-cream-ghost border border-border-warm px-2 py-0.5 rounded uppercase">
                          PNG, JPG, WEBP · MAX 5MB
                        </span>
                      </div>
                    ) : isSimulatingLoad ? (
                      <div className="border border-border-warm rounded-lg p-6 flex flex-col items-center justify-center bg-bg-surface/30 min-h-[160px]">
                        <RefreshCw className="w-6 h-6 text-gold animate-spin mb-3" />
                        <span className="text-xs font-mono text-cream font-medium mb-2 uppercase tracking-widest">
                          Syncing Canvas Frame
                        </span>
                        <div className="w-full max-w-xs bg-border-warm h-1 rounded-full overflow-hidden relative">
                          <motion.div 
                            className="bg-gold h-full rounded-full" 
                            initial={{ width: '0%' }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ ease: 'easeInOut' }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-cream-ghost mt-2">
                          {uploadProgress}% PROCESSED
                        </span>
                      </div>
                    ) : (
                      <div className="border border-gold/20 rounded-lg p-4 bg-bg-surface/40 flex flex-col space-y-3">
                        <div className="flex items-center justify-between border-b border-border-warm pb-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                              <FileImage className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <span className="text-xs font-mono text-cream font-medium block">Custom Screenshot</span>
                              <span className="text-[9px] font-sans text-green-500">Loaded Client-Side</span>
                            </div>
                          </div>
                          <button
                            onClick={clearUploadedImage}
                            className="text-[9px] font-mono text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded px-2 py-1 uppercase transition-all duration-300"
                          >
                            Clear View
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 text-[9px] font-mono text-cream-muted">
                          <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>Local safety checks validated without server storage.</span>
                        </div>
                      </div>
                    )}

                    {/* Runtime error alerts */}
                    {uploadError && (
                      <div className="border border-danger/30 bg-danger/10 text-danger rounded-lg p-3 flex items-start space-x-2 text-xs font-sans">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT COLUMN: Glassmorphic Device Simulator */}
          <div className="lg:col-span-7 w-full flex justify-center" style={{ perspective: 1200 }}>
            
            {/* Widescreen Monitor Frame Wrapper */}
            <motion.div 
              ref={monitorRef}
              onClick={openLightbox}
              style={{ rotateX, rotateY }}
              className={`
                relative w-full max-w-2xl bg-bg-surface/80 rounded-2xl border border-border-warm shadow-[0_30px_60px_-15px_rgba(196,136,44,0.1)] p-3 md:p-4 overflow-hidden select-none group transform-gpu
                ${(activeTab !== 'custom' || uploadedImage) ? 'cursor-zoom-in' : ''}
              `}
            >
              
              {/* Top Status Bar Controls */}
              <div className="flex items-center justify-between border-b border-border-warm/60 pb-3 mb-3 px-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[9px] font-mono text-cream-ghost tracking-widest pl-2">CONSOLE LINK: ACT-1402</span>
                </div>
                <div className="flex items-center space-x-4 text-[9px] font-mono text-cream-ghost">
                  <span className="hidden sm:inline">SAT-GRID: 99.8% UPTIME</span>
                  <span className="bg-border-warm px-1.5 py-0.5 rounded text-gold">VIP LOCK</span>
                </div>
              </div>

              {/* Display Pane */}
              <div className="relative w-full aspect-[16/10] bg-bg-base/90 rounded-lg border border-border-warm/60 overflow-hidden flex items-center justify-center">
                
                {/* Glare and Scanner lines */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cream/2 to-transparent pointer-events-none z-30" />
                <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-30 z-20 animate-[scan-line_4s_ease-in-out_infinite]" />

                {/* Fullscreen indicator on hover */}
                {(activeTab !== 'custom' || uploadedImage) && (
                  <div className="absolute inset-0 bg-bg-base/40 opacity-0 group-hover:opacity-100 flex items-center justify-center z-20 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-gold/90 text-bg-base font-mono text-[9px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-lg shadow-gold/20">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Maximize Console</span>
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  
                  {/* Preset Screens (renders real images) */}
                  {activeTab !== 'custom' && currentPreset && (
                    <motion.div
                      key={currentPreset.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={currentPreset.imagePath}
                        alt={currentPreset.title}
                        className="w-full h-full object-cover object-top filter contrast-[1.02] saturate-[1.01]"
                      />
                    </motion.div>
                  )}

                  {/* Custom upload view */}
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
                            alt="Custom Workspace"
                            className="w-full h-full object-cover object-top filter contrast-[1.03]"
                          />
                          <div className="absolute top-3 left-3 bg-gold/95 text-bg-base font-mono text-[8px] font-bold px-2 py-0.5 rounded tracking-widest uppercase shadow">
                            TELEMETRY LINK SYNCHRONIZED
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between p-5 text-cream-ghost font-mono">
                          <div className="flex items-center justify-between border-b border-border-warm/30 pb-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <Terminal className="w-4 h-4 text-cream-ghost" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">SANDBOX CANVAS</span>
                            </div>
                            <span className="text-[9px] text-red-500 animate-pulse font-bold">STANDBY READY</span>
                          </div>

                          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 border border-dashed border-border-warm/50 rounded bg-bg-surface/10">
                            <Terminal className="w-10 h-10 text-cream-ghost mb-3 opacity-25 animate-pulse" />
                            <h4 className="text-xs text-cream-muted font-bold tracking-widest uppercase mb-1">
                              Canvas Vault Offline
                            </h4>
                            <p className="text-[9px] text-cream-ghost max-w-xs font-sans leading-relaxed">
                              Upload a screenshot of your management systems on the left to project it directly into this widescreen chassis.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-3 text-[8px]">
                            <div className="bg-bg-surface/40 p-2 border border-border-warm/60 rounded">
                              <div className="text-cream-ghost mb-0.5">PARITY CODE</div>
                              <div className="text-cream-ghost font-bold">NOT READY</div>
                            </div>
                            <div className="bg-bg-surface/40 p-2 border border-border-warm/60 rounded">
                              <div className="text-cream-ghost mb-0.5">SECURE SIGNATURE</div>
                              <div className="text-cream-ghost font-bold">PENDING PAYLOAD</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>

          </div>

        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX PORTAL VIEW */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
            
            {/* Backdrop glass */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-[#070504]/96 backdrop-blur-xl"
            />

            {/* Lightbox Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-5xl z-10 flex flex-col justify-center items-center"
            >
              
              {/* Close Button top-right */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-2 md:right-0 w-9 h-9 rounded-full border border-border-warm bg-bg-surface hover:border-gold/50 flex items-center justify-center text-cream-muted hover:text-cream transition-all duration-300"
                aria-label="Close fullscreen view"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Navigator (only if presets) */}
              {lightboxIndex !== -1 && (
                <button
                  onClick={handlePrevLightbox}
                  className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border-warm bg-bg-surface/80 hover:border-gold/50 flex items-center justify-center text-cream hover:text-gold transition-all duration-300 shadow-lg z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Widescreen image display */}
              <div className="relative border border-border-warm bg-bg-surface p-1 md:p-2 rounded-xl shadow-2xl overflow-hidden aspect-[16/10] w-full">
                <img
                  src={lightboxIndex === -1 ? (uploadedImage || '') : presets[lightboxIndex].imagePath}
                  alt="High Resolution Console view"
                  className="w-full h-full object-cover object-top rounded-lg"
                />
              </div>

              {/* Right Navigator (only if presets) */}
              {lightboxIndex !== -1 && (
                <button
                  onClick={handleNextLightbox}
                  className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border-warm bg-bg-surface/80 hover:border-gold/50 flex items-center justify-center text-cream hover:text-gold transition-all duration-300 shadow-lg z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Bottom Details Tag */}
              {lightboxIndex !== -1 && (
                <div className="mt-4 bg-bg-surface border border-border-warm px-5 py-3 rounded-lg text-center max-w-lg shadow-lg">
                  <span className="text-[8px] font-mono text-gold font-bold tracking-[0.2em] uppercase block mb-1">
                    {presets[lightboxIndex].badge}
                  </span>
                  <span className="text-sm font-serif text-cream font-medium">
                    {presets[lightboxIndex].title}
                  </span>
                  <span className="text-[10px] font-mono text-cream-ghost block mt-2.5">
                    VIEWING PAGE {lightboxIndex + 1} OF {presets.length} · CLICK ARROWS TO WALKTHROUGH
                  </span>
                </div>
              )}

              {lightboxIndex === -1 && (
                <div className="mt-4 bg-bg-surface border border-gold/20 px-5 py-3 rounded-lg text-center max-w-sm shadow-lg">
                  <span className="text-[8px] font-mono text-gold font-bold tracking-[0.2em] uppercase block mb-1">
                    CUSTOM PROJECTION
                  </span>
                  <span className="text-sm font-serif text-cream font-medium">
                    User Sandbox Upload Layout
                  </span>
                </div>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ScreenshotGallery;
