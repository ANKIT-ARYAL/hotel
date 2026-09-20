"use client";

import React from "react";

import { motion } from "framer-motion";

import type { DiningPageSettings } from "./types";

interface RestaurantsListProps {
  settings: DiningPageSettings["restaurantsList"];
}

export function RestaurantsList({ settings }: RestaurantsListProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-24  bg-white">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="font-medium tracking-tighter text-zinc-900 mb-6"
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            {settings.title}
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto text-center tracking-tight prose prose-zinc rich-text"
            style={{ fontSize: "var(--theme-body-size)" }}
            dangerouslySetInnerHTML={{ __html: settings.description }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {settings.venues && settings.venues.length > 0 ? (
            settings.venues.map((venue) => (
              <div key={venue.id} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-zinc-200 mb-6 overflow-hidden">
                  <div
                    className="w-full h-full bg-zinc-300 transition-transform duration-700 group-hover:scale-105 bg-cover bg-center"
                    style={{ backgroundImage: `url(${venue.image || ""})` }}
                  />
                </div>
                <h3 className="text-3xl py-2 tracking-tight mb-2">{venue.name}</h3>
                <p className="text-zinc-500 font-light text-justify tracking-tighter"
                style={{ fontSize: "var(--theme-body-size)" }}>{venue.details}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 font-light italic col-span-full text-center">No venues added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
