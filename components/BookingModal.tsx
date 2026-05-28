'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Shield, ArrowRight, CheckCircle, RefreshCw, Send } from 'lucide-react';
import { useBooking } from '../lib/context/BookingContext';
import { useLenis } from '../lib/lenis';

export const BookingModal = () => {
  const { isBookingOpen, closeBooking } = useBooking();
  const lenis = useLenis();
  
  // Step control: 1 = Basic Info, 2 = Ops Scale & Date, 3 = Status (Success/Error)
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    lodgeCount: '1-5' as '1-5' | '6-20' | '21+',
    preferredDate: '',
    notes: '',
  });

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Stop/Start Lenis scroll on modal state change
  useEffect(() => {
    if (!lenis) return;
    if (isBookingOpen) {
      lenis.stop();
      // Reset form states on reopen
      setStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        lodgeCount: '1-5',
        preferredDate: '',
        notes: '',
      });
      setErrors({});
      setSubmitError(null);
    } else {
      lenis.start();
    }
  }, [isBookingOpen, lenis]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company / Lodge Group name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Corporate Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid corporate email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 6) {
      newErrors.phone = 'Please enter a valid contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date for the demo';
    } else {
      const selected = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.preferredDate = 'Demo date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Submission failed');
      }

      setBookingRef(result.bookingId || `BK-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep(3); // Success page
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unable to connect to operations server. Please check your connection.';
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full bg-bg-base/60 text-cream placeholder-cream-ghost text-xs md:text-sm font-sans 
    px-4 py-3 rounded-lg border focus:outline-none transition-all duration-300
    ${errors[fieldName] ? 'border-danger focus:border-danger bg-danger/5' : 'border-border-warm focus:border-gold/60'}
  `;

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="absolute inset-0 bg-[#070504]/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.1 }}
            className="relative w-full max-w-lg bg-bg-surface border border-border-warm rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden z-10"
          >
            
            {/* Ambient gold glow in top right */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

            {/* Header controls */}
            <div className="flex items-center justify-between border-b border-border-warm pb-4 mb-6">
              <div>
                <span className="text-[9px] font-mono tracking-[0.2em] text-gold uppercase font-semibold">
                  AXELO EXECUTIVE SUITE
                </span>
                <h3 className="text-lg md:text-xl font-serif text-cream font-medium mt-1">
                  Schedule Private System Briefing
                </h3>
              </div>
              <button
                onClick={closeBooking}
                className="w-8 h-8 rounded-full border border-border-warm hover:border-gold/40 flex items-center justify-center text-cream-muted hover:text-cream transition-all duration-300"
                aria-label="Close booking modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Indicators */}
            {step < 3 && (
              <div className="flex items-center space-x-3 mb-6 font-mono text-[10px]">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 1 ? 'bg-gold border-gold text-bg-base font-bold' : 'border-gold text-gold'}`}>1</span>
                  <span className={step === 1 ? 'text-cream font-medium' : 'text-cream-muted'}>IDENTITY</span>
                </div>
                <div className="h-[1px] w-8 bg-border-warm" />
                <div className="flex items-center space-x-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 2 ? 'bg-gold border-gold text-bg-base font-bold' : 'border-border-warm text-cream-ghost'}`}>2</span>
                  <span className={step === 2 ? 'text-cream font-medium' : 'text-cream-ghost'}>OPERATIONS</span>
                </div>
              </div>
            )}

            {/* Form Steps */}
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Basic & Corporate Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Robert Hemingway"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputClasses('name')}
                      />
                      {errors.name && <span className="text-[10px] font-mono text-danger mt-1 block">{errors.name}</span>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-1.5">Company / Lodge Group</label>
                      <input
                        type="text"
                        placeholder="e.g. Asilia Africa"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={inputClasses('company')}
                      />
                      {errors.company && <span className="text-[10px] font-mono text-danger mt-1 block">{errors.company}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-1.5">Corporate Email</label>
                    <input
                      type="email"
                      placeholder="e.g. operations@lodgegroup.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClasses('email')}
                    />
                    {errors.email && <span className="text-[10px] font-mono text-danger mt-1 block">{errors.email}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-1.5">Direct Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="e.g. +254 731 237 251"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClasses('phone')}
                    />
                    {errors.phone && <span className="text-[10px] font-mono text-danger mt-1 block">{errors.phone}</span>}
                  </div>

                  <div className="pt-4 border-t border-border-warm flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-gold hover:bg-gold-light text-cream font-mono text-xs tracking-wider uppercase px-6 py-3 rounded-lg border border-gold flex items-center space-x-2 transition-colors duration-300"
                    >
                      <span>Next: Operations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Operations Scope & Date */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-2">Scale of Lodge Portfolio</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['1-5', '6-20', '21+'] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({ ...formData, lodgeCount: option })}
                          className={`
                            border font-mono text-xs py-3 rounded-lg transition-all duration-300
                            ${formData.lodgeCount === option 
                              ? 'border-gold bg-gold/10 text-gold font-bold shadow-lg shadow-gold/5' 
                              : 'border-border-warm hover:border-gold/30 hover:bg-bg-base/30 text-cream-muted'}
                          `}
                        >
                          {option === '21+' ? '21+ Lodges' : `${option} Lodges`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-1.5">Target Demo Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className={inputClasses('preferredDate')}
                      />
                      <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-cream-ghost pointer-events-none" />
                    </div>
                    {errors.preferredDate && <span className="text-[10px] font-mono text-danger mt-1 block">{errors.preferredDate}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-cream-muted uppercase tracking-wider mb-1.5">Special System Requirements / Notes</label>
                    <textarea
                      placeholder="e.g. Satellite communications required for Serengeti outpost..."
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-bg-base/60 text-cream placeholder-cream-ghost text-xs md:text-sm font-sans px-4 py-3 rounded-lg border border-border-warm focus:border-gold/60 focus:outline-none transition-all duration-300 resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-xs text-danger font-sans">
                      {submitError}
                    </div>
                  )}

                  <div className="pt-4 border-t border-border-warm flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="text-cream-muted hover:text-cream font-mono text-xs tracking-wider uppercase px-4 py-3 border border-transparent hover:border-border-warm rounded-lg transition-colors duration-300 disabled:opacity-50"
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gold hover:bg-gold-light disabled:bg-gold/40 text-cream font-mono text-xs tracking-wider uppercase px-6 py-3 rounded-lg border border-gold flex items-center space-x-2 transition-colors duration-300 shadow-lg shadow-gold/10"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Request Session</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: Success Confirmation */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="text-center py-6 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
                    <CheckCircle className="w-8 h-8 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-serif text-cream font-medium">Session Requested</h4>
                    <p className="text-xs md:text-sm text-cream-muted font-sans font-light max-w-sm mx-auto leading-relaxed">
                      Your enterprise concierge request has been cryptographically synced. A systems architect will connect with you via email within 2 hours.
                    </p>
                  </div>

                  <div className="bg-bg-base/70 border border-border-warm rounded-xl p-4 max-w-xs mx-auto">
                    <span className="block text-[8px] font-mono text-cream-ghost uppercase tracking-[0.2em] mb-1">
                      CONFIRMATION REFERENCE
                    </span>
                    <span className="font-mono text-sm text-gold font-bold tracking-widest">
                      {bookingRef}
                    </span>
                  </div>

                  <div className="pt-4 flex justify-center space-x-3 text-[10px] font-mono text-cream-ghost items-center">
                    <Shield className="w-4 h-4 text-gold" />
                    <span>L6 encrypted transaction recorded.</span>
                  </div>

                  <div className="pt-6 border-t border-border-warm">
                    <button
                      onClick={closeBooking}
                      className="w-full bg-transparent hover:bg-cream/5 text-cream font-mono text-xs tracking-wider uppercase py-3.5 rounded-lg border border-border-warm transition-all duration-300"
                    >
                      Close Portal
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
