"use client";

import React from "react";

import { motion } from "framer-motion";

import type { AboutPageSettings } from "./types";

interface AboutHeroProps {
  settings: AboutPageSettings["hero"];
}

export function AboutHero({ settings }: AboutHeroProps) {
  return (
    <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img src={settings.image} alt={settings.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </motion.div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="!text-white mb-6 tracking-tight leading-tight text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"          
        >
          {settings.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="!text-white/90 text-lg md:text-2xl font-light text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"
        >
          {settings.subtitle}
        </motion.p>
      </div>
    </div>
  );
}
