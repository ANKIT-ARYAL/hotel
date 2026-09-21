"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React from "react";

import { motion } from "framer-motion";

import type { AboutPageSettings } from "./types";

interface OurStoryProps {
  settings: AboutPageSettings["ourStory"];
}

export function OurStory({ settings }: OurStoryProps) {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-zinc-900 tracking-tighter uppercase"
            style={{ fontSize: "calc(var(--theme-heading-size) * 0.7)" }}
          >
            {settings.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-600 prose prose-lg prose-zinc font-light leading-relaxed rich-text"
            style={{ fontSize: "var(--theme-body-size)" }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.content) }}
          />
        </div>

        <div className="flex-1 relative w-full h-[600px] flex gap-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="w-1/2 h-[80%] mt-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <img src={settings.image1} alt="Story 1" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-1/2 h-[80%] rounded-xl overflow-hidden shadow-2xl"
          >
            <img src={settings.image2} alt="Story 2" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
