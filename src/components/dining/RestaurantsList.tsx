"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React from "react";

import { motion } from "framer-motion";

import type { DiningPageSettings } from "./types";
import { ServiceReservationForm } from "@/components/guest/ServiceReservationForm";

interface RestaurantsListProps {
  settings: DiningPageSettings["restaurantsList"];
  isLoggedIn?: boolean;
}

export function RestaurantsList({ settings, isLoggedIn = false }: RestaurantsListProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-24  bg-white">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="font-medium text-zinc-900 mb-6 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"            
          >
            {settings.title}
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto text-center tracking-tight prose prose-zinc rich-text text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"            
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.description) }}
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
                <h3 className="text-3xl py-2 tracking-tight mb-2 font-[var(--theme-heading-font)]">{venue.name}</h3>
                <p className="text-zinc-500 font-light text-justify tracking-tighter text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"
                >
                  {venue.details}
                </p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 font-light italic col-span-full text-center font-[var(--theme-body-font)]">No venues added yet.</p>
          )}
        </div>
        {settings.venues?.length > 0 && <div className="mt-20 rounded-2xl bg-zinc-50 p-8 text-center md:p-14"><h3 className="text-3xl font-medium text-zinc-900">Reserve your dining experience</h3><p className="mx-auto mt-3 max-w-xl text-zinc-500">Choose one of our current venues and send your reservation request to the hotel team.</p><ServiceReservationForm type="dining" options={settings.venues.map((venue) => venue.name)} isLoggedIn={isLoggedIn} trigger={<button type="button" className="mt-8 rounded-md bg-zinc-900 px-7 py-3 font-medium text-white">Reserve a table</button>} /></div>}
      </div>
    </section>
  );
}
