"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import type { DiningSliderSection } from "./types";

interface DiningFeatureSectionProps {
  section: DiningSliderSection;
  reverse?: boolean;
}

export function DiningFeatureSection({ section, reverse = false }: DiningFeatureSectionProps) {
  if (!section.isVisible) return null;

  const image = section.images && section.images.length > 0 ? section.images[0] : null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 w-full">
      <div
        className={`flex flex-col md:flex-row gap-12 lg:gap-24 items-center ${reverse ? "md:flex-row-reverse" : ""}`}
      >
        {/* Text Content */}
        <div className="flex-1 w-full space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-medium tracking-tighter leading-[1.1] text-zinc-900"
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            {section.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-zinc max-w-none text-justify text-zinc-600 tracking-tighter rich-text"
            style={{ fontSize: "var(--theme-body-size)" }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description) }}
          />
        </div>

        {/* Image Content */}
        <div className="flex-1 w-full">
          {image ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-sm bg-zinc-100 shadow-xl"
            >
              <Image
                src={image.url}
                alt={section.title}
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
            </motion.div>
          ) : (
            <div className="aspect-square w-full bg-zinc-100 rounded-sm flex items-center justify-center text-zinc-400">
              No image provided
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
