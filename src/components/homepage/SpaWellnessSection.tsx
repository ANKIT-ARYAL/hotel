'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HomepageSettings } from './types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SpaWellnessSectionProps {
  settings: HomepageSettings['spaWellness'];
}

export function SpaWellnessSection({ settings }: SpaWellnessSectionProps) {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden py-24 px-6 md:px-12 lg:px-24">
      {/* Background Image with Parallax-like scale */}
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img
          src={settings.image}
          alt="Spa and Wellness"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Heavy Radial / Vignette Scrims for Center Contrast */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/90 z-10" />

      {/* Centered Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
        
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-argine text-white text-5xl md:text-7xl lg:text-[7.5rem] leading-[0.9] tracking-tighter"
        >
          {settings.title}
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-10"
        >
          <div 
            className="text-white/80 max-w-2xl font-light text-xl text-center"
            dangerouslySetInnerHTML={{ __html: settings.description }}
          />
          
          <Button size="lg" className="group bg-transparent border border-white/30 text-white hover:bg-white hover:text-black hover:border-white h-14 px-8 rounded-full font-medium tracking-wide transition-all duration-500 w-fit text-xl">
            {settings.buttonLabel}
            <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-2" />
          </Button>
        </motion.div>
        
      </div>
    </div>
  );
}
