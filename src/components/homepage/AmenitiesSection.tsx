/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

import type { HomepageSettings } from "./types";

interface AmenitiesSectionProps {
  settings: HomepageSettings["amenities"];
}

export function AmenitiesSection({ settings }: AmenitiesSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 bg-transparent">
      <div className="px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1
            className="text-black leading-[1] tracking-tighter mb-8 pr-4"
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            {settings.title}
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto " style={{ fontSize: "var(--theme-body-size)" }}>
            {settings.description}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {settings.items.map((item, idx) => {
            const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Star;

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group p-8 rounded-2xl border border-transparent hover:border-zinc-200 hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center bg-white/40 backdrop-blur-sm cursor-default"
              >
                <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-500">
                  <IconComponent className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl text-xl font-serif font-bold text-zinc-900 mb-3">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed font-sans text-lg">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
