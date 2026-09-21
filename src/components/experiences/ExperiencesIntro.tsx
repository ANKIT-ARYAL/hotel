"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React from "react";

import { motion } from "framer-motion";

import type { ExperiencesPageSettings } from "./types";

interface ExperiencesIntroProps {
  settings: ExperiencesPageSettings["intro"];
}

export function ExperiencesIntro({ settings }: ExperiencesIntroProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-white flex justify-center w-full">
      <div className="text-center flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-medium tracking-tighter text-zinc-900 mb-10 text-5xl md:text-[length:var(--theme-heading-size)]"          
        >
          {settings.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-zinc-600 font-light text-justify md:text-center tracking-tighter md:text-xl mx-auto rich-text text-lg md:text-[length:var(--theme-body-size)]"          
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.description) }}
        />
      </div>
    </section>
  );
}
