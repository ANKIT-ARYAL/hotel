'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HomepageSettings } from './types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface OurStorySectionProps {
  settings: HomepageSettings['ourStory'];
}

export function OurStorySection({ settings }: OurStorySectionProps) {
  if (!settings?.isVisible) return null;

  return (
    <section className="bg-transparent text-zinc-900 py-32 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-8xl font-argine font-medium leading-[0.9] tracking-tighter max-w-3xl text-zinc-900"
          >
            {settings.title}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button size="lg" variant="outline" className="group border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 h-14 px-8 rounded-full font-medium tracking-wide transition-all duration-500 w-fit">
              {settings.buttonLabel}
              <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-2" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Magazine Style Portrait Image */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl shadow-zinc-200/50 relative">
              <Image 
                src={settings.image} 
                alt="Our Story" 
                fill
                className="object-cover mix-blend-multiply transition-all duration-700"
              />
            </div>
            {/* Architectural accent line */}
            <div className="hidden lg:block absolute -right-8 top-1/4 bottom-1/4 w-[1px] bg-zinc-200" />
          </motion.div>

          {/* Right: Editorial Typography */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="flex items-center mb-10">
               <span className="text-sm font-medium tracking-widest uppercase text-zinc-400 mr-6">Est. 1924</span>
               <div className="flex-1 h-[1px] bg-zinc-200" />
            </div>

            <div 
              className="text-xl md:text-2xl text-zinc-600 font-light leading-relaxed prose prose-zinc prose-p:font-light prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: settings.description }}
            />
            
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
