"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React from "react";

import { motion } from "framer-motion";

import type { SpaPageSettings } from "./types";

interface SpaIntroProps {
  settings: SpaPageSettings["intro"];
}

export function SpaIntro({ settings }: SpaIntroProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="sm:py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-white flex justify-center w-full">
      <div className="text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileInView={{ opacity: 1, height: 64 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-[1px] bg-zinc-300 mb-12"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-medium tracking-tighter text-zinc-900 mb-8 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"          
        >
          {settings.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-zinc-500 font-light text-justify tracking-tighter rich-text text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"          
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.description) }}
        />
      </div>
    </section>
  );
}
