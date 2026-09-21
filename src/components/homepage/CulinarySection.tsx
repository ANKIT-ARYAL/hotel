"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { HomepageSettings } from "./types";

interface CulinarySectionProps {
  settings: HomepageSettings["culinary"];
}

export function CulinarySection({ settings }: CulinarySectionProps) {
  return (
    <div className="relative h-[100dvh] min-h-[600px] max-h-[1200px] 2xl:max-h-[1600px] w-full flex flex-col justify-end overflow-hidden pb-12 px-6 md:px-12 lg:px-24">
      {/* Background Image with Parallax-like scale */}
      <motion.div
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img src={settings.image} alt="Culinary" className="w-full h-full object-cover" />
      </motion.div>

      {/* Editorial Gradient Scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/10 to-transparent z-10" />

      {/* Content locked to bottom-right */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto flex flex-col items-end text-right gap-8">
        <div className="max-w-3xl flex-1 flex flex-col items-end">
          <motion.h2
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
  className="text-white leading-[0.9] tracking-tighter mb-8 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"
>
  {settings.title}
</motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-8"
          >
            <div
              className="text-white max-w-lg font-light text-justify tracking-tighter rich-text text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"              
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.description) }}
            />
            <Link href="/dining">
              <Button
                size="lg"
                className="group bg-white text-black hover:bg-zinc-200 h-14 px-8 rounded-full font-medium tracking-wide transition-all duration-500 w-fit mt-4 font-[var(--theme-body-font)]"
              >
                {settings.buttonLabel}
                <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
