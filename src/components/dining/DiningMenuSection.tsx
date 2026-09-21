"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";

import type { MenuSection } from "./types";

interface DiningMenuSectionProps {
  section: MenuSection;
}

export function DiningMenuSection({ section }: DiningMenuSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flatten all items from all categories if multiple exist, though for specials it's likely just one category
  const allItems = section.categories.flatMap((c) => c.items);

  useEffect(() => {
    if (allItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allItems.length);
    }, 5000); // 5s loop
    return () => clearInterval(interval);
  }, [allItems.length]);

  if (!section.isVisible || allItems.length === 0) return null;

  const currentItem = allItems[currentIndex];

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 w-full bg-zinc-50 relative overflow-hidden my-12 rounded-lg">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Side: Text / Details */}
        <div className="flex-1 w-full space-y-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-medium tracking-tighter leading-[1.1] text-zinc-900 mb-4 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"              
            >
              {section.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="prose prose-zinc max-w-none prose-p:font-light prose-p:leading-relaxed text-zinc-600 tracking-tighter text-justify rich-text text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description) }}
            />
          </div>

          {/* Dish Details Card */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-100 min-h-[250px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-semibold text-3xl tracking-tight text-zinc-900 font-[var(--theme-heading-font)]">{currentItem.name}</h3>
                  {currentItem.price && (
                    <span className="text-xl text-zinc-500 font-light whitespace-nowrap font-[var(--theme-body-font)]">{currentItem.price}</span>
                  )}
                </div>

                <p className="text-zinc-600 font-light text-justify tracking-tighter text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"
                >
                  {currentItem.description}
                </p>

                {currentItem.dietaryTags && currentItem.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentItem.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700"
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="absolute bottom-6 left-8 flex gap-2">
              {allItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-zinc-800 w-6" : "bg-zinc-300 hover:bg-zinc-400"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Image Slider */}
        <div className="flex-1 w-full aspect-square md:aspect-[4/3] lg:aspect-square relative rounded-xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {currentItem.image ? (
                <Image src={currentItem.image} alt={currentItem.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 font-[var(--theme-body-font)]">
                  No Image Available
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
