"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import type { SpaPageSettings } from "./types";
import { ServiceReservationForm } from "@/components/guest/ServiceReservationForm";

interface SpaTreatmentsListProps {
  settings: SpaPageSettings["treatments"];
}

export function SpaTreatmentsList({ settings, isLoggedIn = false }: SpaTreatmentsListProps & { isLoggedIn?: boolean }) {
  if (!settings.isVisible) return null;
  const treatmentOptions = settings.categories.flatMap((category) => category.treatments.map((treatment) => treatment.name));

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 w-full bg-zinc-50">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
        {/* Left Column: sticky header */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-medium tracking-tighter text-zinc-900 mb-6 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"              
            >
              {settings.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 font-light leading-relaxed prose prose-zinc rich-text text-lg text-[var(--theme-body-size)] font-[var(--theme-body-font)]"              
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.description) }}
            />
          </div>
        </div>

        {/* Right Column: Accordions for Categories */}
        <div className="lg:w-2/3 space-y-16">
          {settings.categories.map((category, catIdx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h3 className="text-4xl font-medium tracking-tight text-zinc-900 mb-8 border-b border-zinc-200 pb-4 font-[var(--theme-heading-font)]">
                {category.name}
              </h3>
              <div className="space-y-4">
                {category.treatments.map((treatment) => (
                  <TreatmentAccordion key={treatment.id} treatment={treatment} options={treatmentOptions} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TreatmentAccordion({
  treatment,
  options,
  isLoggedIn,
}: {
  treatment: SpaPageSettings["treatments"]["categories"][0]["treatments"][0];
  options: string[];
  isLoggedIn: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-zinc-100 bg-white rounded-lg overflow-hidden transition-all hover:border-zinc-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none"
      >
        <div className="flex-1">
          <h4 className="text-3xl font-medium text-zinc-900 font-[var(--theme-body-font)]">{treatment.name}</h4>
          <div className="text-sm text-zinc-400 mt-2 font-light tracking-wide flex items-center gap-4 font-[var(--theme-body-font)]">
            <span>{treatment.duration}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span>{treatment.price}</span>
          </div>
        </div>
        <div className="ml-6 text-zinc-400 flex-shrink-0">
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-6 pt-2 text-zinc-500 font-light text-justify tracking-tighter text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"
            >
              {treatment.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ServiceReservationForm type="spa" options={options} initialOption={treatment.name} isLoggedIn={isLoggedIn} trigger={<button type="button" className="mx-8 mb-6 rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white">Book this treatment</button>} />
    </div>
  );
}
