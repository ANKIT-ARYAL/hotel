"use client";

import React from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import type { ExperiencesPageSettings } from "./types";

interface ExperiencesFeaturedProps {
  settings: ExperiencesPageSettings["featured"];
}

export function ExperiencesFeatured({ settings }: ExperiencesFeaturedProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 w-full bg-zinc-900 text-white overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-20 items-end">
        <div className="lg:w-1/2">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-medium tracking-tighter mb-6"
            style={{ fontSize: settings.typography?.titleSize || "var(--theme-heading-size)" }}
          >
            {settings.title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 font-light leading-relaxed prose prose-invert prose-lg"
            style={{ fontSize: settings.typography?.bodySize || "var(--theme-body-size)" }}
            dangerouslySetInnerHTML={{ __html: settings.description }}
          />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-16 snap-x snap-mandatory hide-scrollbar -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 space-x-8">
        {settings.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] snap-center relative group cursor-pointer"
          >
            <div className="aspect-[4/5] md:aspect-video relative overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <p className="text-white/80 uppercase tracking-widest text-sm mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {item.duration}
                </p>
                <h3 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {item.name}
                </h3>
                <p className="text-zinc-200 font-light leading-relaxed line-clamp-2 md:line-clamp-none transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
