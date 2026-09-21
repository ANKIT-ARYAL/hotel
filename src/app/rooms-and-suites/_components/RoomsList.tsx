"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React, { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Amenity, Image as PrismaImage, RoomCategory } from "@prisma/client";
import { motion, useScroll, useTransform } from "framer-motion";

import { defaultRoomsPageSettings, type RoomsPageSettings } from "@/components/rooms/types";

type RoomCategoryWithRelations = RoomCategory & {
  images: PrismaImage[];
  amenities?: Amenity[];
};

interface RoomsListProps {
  categories: RoomCategoryWithRelations[];
  settings?: RoomsPageSettings;
}

export function RoomsList({ categories, settings = defaultRoomsPageSettings }: RoomsListProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <>
      {/* Hero Section */}
      {settings.hero?.isVisible && (
        <section ref={heroRef} className="relative h-[80vh] w-full overflow-hidden bg-zinc-900">
          <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
              <source src={settings.hero.videoUrl || "/uploads/1789275742970-291594583.mp4"} type="video/mp4" />
            </video>
          </motion.div>
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4 text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="tracking-tight mb-6 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"              
            >
              {settings.hero.title}
            </motion.h1>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl font-light tracking-wide max-w-2xl text-zinc-200 rich-text text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.hero.subtitle) }}
            />
          </div>
        </section>
      )}

      {/* Intro Section */}
      {settings.listSection?.isVisible && (
        <section className="py-24 px-6 md:px-12 lg:px-24 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-[length:var(--theme-heading-size)]  mb-6 font-[var(--theme-heading-font)]"
          >
            {settings.listSection.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-600 text-lg font-light leading-relaxed rich-text text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"            
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.listSection.description) }}
          />
        </section>
      )}

      {/* Rooms List Section */}
      <section className="pb-32 px-6 md:px-12 lg:px-24 space-y-32">
        {categories.map((cat, index) => {
          const isReversed = index % 2 !== 0;
          const coverImage = cat.images && cat.images.length > 0 ? cat.images[0].url : null;

          return (
            <div
              key={cat.id}
              className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-24 items-center group`}
            >
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 overflow-hidden aspect-[4/3] rounded-sm relative bg-zinc-100"
              >
                <Link href={`/rooms-and-suites/${cat.slug || cat.id}`} className="block w-full h-full">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-medium font-[var(--theme-body-font)]">
                      No Image Available
                    </div>
                  )}
                </Link>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="w-full lg:w-1/2 space-y-6"
              >
                <h2 className="text-4xl text-zinc-900 tracking-wide font-[var(--theme-heading-font)]">{cat.name}</h2>
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 uppercase tracking-widest font-medium border-b border-zinc-200 pb-4 font-[var(--theme-body-font)]">
                  {cat.size && <span>{cat.size}</span>}
                  {cat.occupancy && <span>Up to {cat.occupancy} Guests</span>}
                  {cat.bedType && <span>{cat.bedType}</span>}
                </div>
                <p className="text-zinc-600 text-justify tracking-tighter font-light line-clamp-4 font-[var(--theme-body-font)] text-lg md:text-[length:var(--theme-body-size)]">
                  {cat.description || "A beautiful room offering comfort and luxury."}
                </p>
                <div className="pt-4">
                  <Link
                    href={`/rooms-and-suites/${cat.slug || cat.id}`}
                    className="inline-flex items-center text-sm font-medium tracking-widest uppercase text-zinc-900 hover:text-zinc-500 transition-colors font-[var(--theme-body-font)]"
                  >
                    Explore Rooms
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          );
        })}
        {categories.length === 0 && (
          <div className="text-center text-zinc-500 py-12 text-xl font-light font-[var(--theme-body-font)]">
            No rooms available at the moment. Please check back later.
          </div>
        )}
      </section>
    </>
  );
}
