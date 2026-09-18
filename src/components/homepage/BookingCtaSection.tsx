"use client";

import React from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { HomepageSettings } from "./types";

interface BookingCtaSectionProps {
  settings: HomepageSettings["bookingCta"];
}

export function BookingCtaSection({ settings }: BookingCtaSectionProps) {
  if (!settings?.isVisible) return null;

  return (
    <div className="relative h-[100dvh] min-h-[600px] max-h-[1200px] 2xl:max-h-[1600px] w-full flex flex-col justify-center items-center overflow-hidden py-24 px-6 md:px-12 lg:px-24">
      {/* Background Image with Parallax-like scale */}
      <motion.div
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img src={settings.image} alt="Book Now" className="w-full h-full object-cover" />
      </motion.div>

      {/* Intense gradient scrims to make text pop */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-10" />

      {/* Centered Massive CTA Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-12 mt-20">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-white leading-[0.85] tracking-tighter"
          style={{ fontSize: "var(--theme-heading-size)" }}
        >
          {settings.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-12"
        >
          <div
            className="text-white/80 max-w-2xl font-light prose prose-invert  text-center"
            style={{ fontSize: "var(--theme-body-size)" }}
            dangerouslySetInnerHTML={{ __html: settings.description }}
          />
          <Link href="/contact">
            <Button
              size="lg"
              className="group bg-white text-black hover:bg-zinc-200 h-20 px-12 text-lg rounded-full font-medium tracking-wide transition-all duration-500 w-fit mt-4"
            >
              {settings.buttonLabel}
              <ArrowRight className="w-5 h-5 ml-4 transition-transform duration-500 group-hover:translate-x-3" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
