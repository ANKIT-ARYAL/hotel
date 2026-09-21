/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";

import type { AboutPageSettings } from "./types";

interface CoreValuesProps {
  settings: AboutPageSettings["coreValues"];
}

export function CoreValues({ settings }: CoreValuesProps) {
  return (
    <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2
            className="text-zinc-900 tracking-tighter uppercase mb-6 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"            
          >
            {settings.title}
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-light text-justify tracking-tighter text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]">{settings.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {settings.values.map((value, idx) => {
            const Icon = (Icons as any)[value.icon] || Icons.Star;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-xl shadow-zinc-200/20 hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-8 text-zinc-900">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium tracking-wide uppercase mb-4 text-zinc-900 font-[var(--theme-heading-font)]">{value.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-light font-[var(--theme-body-font)]">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
