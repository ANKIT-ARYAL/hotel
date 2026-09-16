'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HomepageSettings } from './types';
import { Star } from 'lucide-react';

interface TestimonialsSectionProps {
  settings: HomepageSettings['testimonials'];
}

export function TestimonialsSection({ settings }: TestimonialsSectionProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-24 bg-zinc-900 text-white overflow-hidden relative">
      <div className="px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-argine font-normal text-white mb-6">
            {settings.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {settings.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-8 flex flex-col h-full rounded-2xl hover:bg-black/40 transition-colors"
            >
              <div className="flex gap-1 mb-6 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < item.rating ? 'fill-current' : 'opacity-30'}`} 
                  />
                ))}
              </div>
              
              <blockquote className="text-lg md:text-xl font-light text-zinc-300 leading-relaxed mb-8 flex-1 italic">
                &quot;{item.quote}&quot;
              </blockquote>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-lg font-argine text-[#D4AF37]">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white tracking-wide text-base">{item.name}</h4>
                  <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium mt-1">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
