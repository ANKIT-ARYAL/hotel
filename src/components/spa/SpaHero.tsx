"use client";

import React from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import type { SpaPageSettings } from "./types";

interface SpaHeroProps {
  settings: SpaPageSettings["hero"];
}

export function SpaHero({ settings }: SpaHeroProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="relative h-[80vh] min-h-[600px] max-h-[1000px] 2xl:max-h-[1200px] w-full flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image src={settings.image} alt={settings.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </motion.div>

      <div className="relative z-10 text-center px-6 md:px-12 lg:px-24 w-full flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-white font-medium uppercase mb-6"
          style={{
            fontFamily: "var(--theme-heading-font)",
            fontSize: "var(--theme-heading-size)",
          }}
        >
          {settings.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-white/90 font-light tracking-wide max-w-2xl"
          style={{ fontSize: "var(--theme-body-size)" }}
        >
          {settings.subtitle}
        </motion.p>
      </div>
    </section>
  );
}
