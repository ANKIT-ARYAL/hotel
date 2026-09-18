"use client";

import React from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import type { DiningSliderSection } from "./types";

interface DiningGridSectionProps {
  section: DiningSliderSection;
}

export function DiningGridSection({ section }: DiningGridSectionProps) {
  if (!section.isVisible) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 w-full bg-white">
      <div className="text-center mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-medium tracking-tighter leading-[1.1] text-zinc-900 mb-6"
          style={{ fontSize: section.typography?.titleSize || "var(--theme-heading-size)" }}
        >
          {section.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="prose prose-zinc mx-auto prose-p:font-light prose-p:leading-relaxed text-zinc-600 tracking-tight"
          style={{ fontSize: section.typography?.bodySize || "var(--theme-body-size)" }}
          dangerouslySetInnerHTML={{ __html: section.description }}
        />
      </div>

      {section.images && section.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {section.images.slice(0, 3).map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className={`relative w-full rounded-sm overflow-hidden bg-zinc-100 shadow-lg ${
                idx === 0 ? "aspect-[4/5]" : idx === 1 ? "aspect-square md:mt-12" : "aspect-[4/3] md:mt-24"
              }`}
            >
              <Image
                src={img.url}
                alt={`${section.title} image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-1000 hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
