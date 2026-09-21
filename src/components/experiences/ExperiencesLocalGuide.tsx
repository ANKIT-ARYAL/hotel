"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import type { ExperiencesPageSettings } from "./types";

interface ExperiencesLocalGuideProps {
  settings: ExperiencesPageSettings["localGuide"];
}

export function ExperiencesLocalGuide({ settings }: ExperiencesLocalGuideProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 w-full bg-zinc-50 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Sticky Header */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-medium tracking-tighter text-zinc-900 mb-6 text-5xl md:text-[length:var(--theme-heading-size)]"              
            >
              {settings.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 font-light text-justify tracking-tighter rich-text text-lg md:text-[length:var(--theme-body-size)]"              
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.description) }}
            />
          </div>
        </div>

        {/* Timeline List */}
        <div className="lg:w-2/3">
          <div className="relative border-l border-zinc-200 pl-8 md:pl-16 space-y-24">
            {settings.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Node */}
                <div className="absolute -left-[41px] md:-left-[73px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-4 border-zinc-50" />

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-3xl font-medium tracking-tight text-zinc-900 mb-3">{item.name}</h3>
                    <div className="flex items-center text-zinc-400 text-sm font-medium uppercase tracking-widest mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {item.distance}
                    </div>
                    <p className="text-zinc-500 font-light text-justify tracking-tighter text-lg md:text-[length:var(--theme-body-size)]"                    
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className="w-full md:w-48 lg:w-64 aspect-video md:aspect-square relative rounded-lg overflow-hidden shadow-md flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-700"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
