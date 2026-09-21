"use client";

import type React from "react";
import { useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { GalleryPageSettings } from "./types";

interface GalleryMasonryProps {
  settings: GalleryPageSettings;
}

export function GalleryMasonry({ settings }: GalleryMasonryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "all" ? settings.images : settings.images.filter((img) => img.categoryId === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-white w-full min-h-screen">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
        {settings.categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`text-sm md:text-base font-medium tracking-widest uppercase pb-2 border-b-2 transition-colors  font-[var(--theme-body-font)]${
              activeCategory === category.id
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {filteredImages.map((image, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={image.id}
              className="break-inside-avoid relative group cursor-zoom-in"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-sm">
                <Image
                  src={image.url}
                  alt={image.title}
                  width={800}
                  height={600}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <h3 className="text-white font-medium tracking-wide text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-[var(--theme-heading-font)]">
                    {image.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 font-[var(--theme-body-font)]"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            <button
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 font-[var(--theme-body-font)]"
              onClick={prevImage}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 font-[var(--theme-body-font)]"
              onClick={nextImage}
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl aspect-video mx-4 md:mx-32 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].title}
                fill
                className="object-contain"
              />
              <div className="absolute -bottom-16 left-0 text-white/80 font-light tracking-wide text-lg font-[var(--theme-heading-font)]">
                {filteredImages[lightboxIndex].title}
              </div>
              <div className="absolute -bottom-16 right-0 text-white/50 font-medium tracking-widest text-sm font-[var(--theme-body-font)]">
                {lightboxIndex + 1} / {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
