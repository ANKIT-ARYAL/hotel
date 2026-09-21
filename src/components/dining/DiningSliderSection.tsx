"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";

import type { DiningSliderSection as DiningSliderSectionType } from "./types";

interface DiningSliderSectionProps {
  section: DiningSliderSectionType;
}

export function DiningSliderSection({ section }: DiningSliderSectionProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!section.images || section.images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % section.images.length);
    }, 5000); // 5 seconds delay

    return () => clearInterval(interval);
  }, [section.images]);

  if (!section.isVisible) return null;

  // We need at least 3 images for the layout to look good, but we handle fewer gracefully.
  const images = section.images || [];
  const topImage = images.length > 0 ? images[index % images.length] : null;
  const bottomLeftImage = images.length > 1 ? images[(index + 1) % images.length] : null;
  const bottomRightImage =
    images.length > 2 ? images[(index + 2) % images.length] : images.length === 2 ? images[0] : null;

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 items-center">
        {/* Left Side: Text */}
        <div className="flex flex-col justify-center">
          <h1
            className="text-black leading-[1] tracking-tighter mb-8 pr-4 w-1/2"
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            {section.title}
          </h1>
          <div
            className="prose prose-zinc max-w-none text-zinc-600 tracking-tighter text-justify rich-text"
            style={{ fontSize: "var(--theme-body-size)" }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description) }}
          />
        </div>

        {/* Right Side: Top Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-100 shadow-xl">
          <AnimatePresence mode="wait">
            {topImage ? (
              <motion.div
                key={`top-${topImage.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image src={topImage.url} alt={section.title} fill className="object-cover" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">No images</div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Row: 2 Images */}
      {(bottomLeftImage || bottomRightImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full mt-12">
          {/* Bottom Left */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-100 shadow-lg">
            <AnimatePresence mode="wait">
              {bottomLeftImage && (
                <motion.div
                  key={`bl-${bottomLeftImage.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image src={bottomLeftImage.url} alt={section.title} fill className="object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Right */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-100 shadow-lg">
            <AnimatePresence mode="wait">
              {bottomRightImage && (
                <motion.div
                  key={`br-${bottomRightImage.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image src={bottomRightImage.url} alt={section.title} fill className="object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}
