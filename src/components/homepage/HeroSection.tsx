'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HomepageSettings } from './types';
import { Calendar, User, ChevronDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  settings: HomepageSettings['hero'];
}

export function HeroSection({ settings }: HeroSectionProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [guests, setGuests] = useState('1 Room, 2 Guests');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (arrivalDate) params.set('arrival', arrivalDate);
    if (departureDate) params.set('departure', departureDate);
    params.set('guests', guests);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-end overflow-hidden pb-12 px-6 md:px-12 lg:px-24">
      {/* Background Video */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster={settings.backgroundImageFallback}
        >
          <source src={settings.videoUrl} type="video/mp4" />
        </video>
      </motion.div>
      
      {/* Editorial Gradient Scrim (stronger at left and center) */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />

      {/* Content locked to left-middle */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto flex flex-col gap-12">
        
        <div className="max-w-4xl flex-1">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-nove text-white text-5xl md:text-6xl lg:text-[5.5rem] leading-[1] tracking-tighter mb-8 pr-4"
          >
            {settings.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-center gap-8"
          >
            <div 
              className="text-white/80 max-w-lg font-light prose prose-invert text-xl"
              dangerouslySetInnerHTML={{ __html: settings.subtitle }}
            />
          </motion.div>

          {/* Interactive Booking Bar (Moved to left) */}
          <motion.div 
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-fit min-w-[320px] shrink-0 mt-10"
          >
            <motion.div layout className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header (Always visible) */}
              <motion.div layout="position"
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsBookingOpen(!isBookingOpen)}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-lg tracking-wide">Reserve a Room</span>
                </div>
                <motion.div
                  animate={{ rotate: isBookingOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-white/70"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </motion.div>

              {/* Collapsible Content */}
              <AnimatePresence>
                {isBookingOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6 flex flex-col lg:flex-row items-end gap-6">
                      <div className="flex flex-col gap-2 w-full lg:w-auto flex-1">
                        <label className="text-md uppercase font-bold tracking-[0.2em] text-white/50">Arrival</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                          <input 
                            type="date"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/30 [color-scheme:dark]"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full lg:w-auto flex-1">
                        <label className="text-sm uppercase font-bold tracking-[0.2em] text-white/50">Departure</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                          <input 
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/30 [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full lg:w-auto flex-1">
                        <label className="text-sm uppercase font-bold tracking-[0.2em] text-white/50">Guests</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                          <select 
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors appearance-none cursor-pointer [color-scheme:dark]"
                          >
                            <option className="bg-zinc-900 text-white">1 Room, 1 Guest</option>
                            <option className="bg-zinc-900 text-white">1 Room, 2 Guests</option>
                            <option className="bg-zinc-900 text-white">2 Rooms, 4 Guests</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                        </div>
                      </div>

                      <Button 
                        onClick={handleSearch}
                        className="w-full lg:w-auto shrink-0 bg-white text-black hover:bg-zinc-200 h-[50px] px-8 rounded-lg font-medium tracking-wide"
                      >
                        Check Availability
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
