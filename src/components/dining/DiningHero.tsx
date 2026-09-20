"use client";

import React, { useRef } from "react";

import { motion, useScroll, useTransform } from "framer-motion";

import type { DiningPageSettings } from "./types";

interface DiningHeroProps {
  settings: DiningPageSettings["hero"];
}

export function DiningHero({ settings }: DiningHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  if (!settings.isVisible) return null;

  return (
    <section
      ref={heroRef}
      className="relative h-[80vh] min-h-[600px] max-h-[1000px] 2xl:max-h-[1200px] w-full overflow-hidden bg-zinc-900"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/30 z-10" />
        {settings.videoUrl ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
            <source src={settings.videoUrl} type="video/mp4" />
          </video>
        ) : settings.image ? (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${settings.image})` }}
          />
        ) : null}
      </motion.div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4 text-center">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-medium tracking-tighter mb-6"
          style={{ fontSize: "var(--theme-heading-size)" }}
        >
          {settings.title}
        </motion.h1>
        {settings.subtitle && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-white/80 font-light tracking-wide max-w-2xl mx-auto rich-text"
            style={{ fontSize: "var(--theme-body-size)" }}
            dangerouslySetInnerHTML={{ __html: settings.subtitle }}
          />
        )}
      </div>
    </section>
  );
}
