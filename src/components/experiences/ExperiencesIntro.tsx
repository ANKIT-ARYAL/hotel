"use client";

import React from "react";

import { motion } from "framer-motion";

import type { ExperiencesPageSettings } from "./types";

interface ExperiencesIntroProps {
  settings: ExperiencesPageSettings["intro"];
}

export function ExperiencesIntro({ settings }: ExperiencesIntroProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-white flex justify-center w-full">
      <div className="max-w-5xl text-center flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-medium tracking-tighter text-zinc-900 mb-10"
          style={{ fontSize: settings.typography?.titleSize || "var(--theme-heading-size)" }}
        >
          {settings.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-zinc-600 font-light leading-relaxed tracking-wide prose prose-zinc md:text-xl mx-auto"
          style={{ fontSize: settings.typography?.bodySize || "var(--theme-body-size)" }}
          dangerouslySetInnerHTML={{ __html: settings.description }}
        />
      </div>
    </section>
  );
}
