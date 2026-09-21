"use client";

import React from "react";

import Image from "next/image";

import { motion, useScroll, useTransform } from "framer-motion";

import type { ExperiencesPageSettings } from "./types";

interface ExperiencesHeroProps {
  settings: ExperiencesPageSettings["hero"];
}

export function ExperiencesHero({ settings }: ExperiencesHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);

  if (!settings.isVisible) return null;

  return (
    <section className="relative h-[80vh] min-h-[600px] max-h-[1000px] 2xl:max-h-[1200px] w-full flex items-center justify-center overflow-hidden bg-black">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src={settings.image} alt={settings.title} fill className="object-cover opacity-80" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 text-center px-6 md:px-12 lg:px-24 w-full flex flex-col items-center mt-32">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-white/80 font-light tracking-[0.3em] uppercase text-sm md:text-base mb-6 text-lg md:text-[length:var(--theme-body-size)]"          
        >
          {settings.subtitle}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-white font-medium tracking-tight text-5xl md:text-[length:var(--theme-heading-size)]"
          style={{
            fontFamily: "var(--theme-heading-font)",            
          }}
        >
          {settings.title}
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50"
      >
        <span className="text-xs uppercase tracking-widest mb-4">Discover</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
