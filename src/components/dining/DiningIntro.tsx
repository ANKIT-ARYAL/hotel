"use client";

import React from "react";

import { motion } from "framer-motion";

import type { DiningPageSettings } from "./types";

interface DiningIntroProps {
  settings: DiningPageSettings["intro"];
}

export function DiningIntro({ settings }: DiningIntroProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-50 flex items-center justify-center">
      <div className="w-full flex flex-col items-center text-center">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-medium tracking-tighter text-zinc-900 mb-8"
          style={{ fontSize: "var(--theme-heading-size)" }}
        >
          {settings.title}
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-zinc-600 font-light leading-relaxed tracking-tight text-center max-w-2xl prose prose-zinc rich-text"
          style={{ fontSize: "var(--theme-body-size)" }}
          dangerouslySetInnerHTML={{ __html: settings.description }}
        />
      </div>
    </section>
  );
}
