"use client";

import React from "react";

import { motion } from "framer-motion";

import type { AboutPageSettings } from "./types";

interface TeamSectionProps {
  settings: AboutPageSettings["team"];
}

export function TeamSection({ settings }: TeamSectionProps) {
  return (
    <section className="py-16 md:py-32 px-6 md:px-12 lg:px-24 bg-white">
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
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-light text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]">{settings.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {settings.members.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="flex flex-col group"
            >
              <div className="aspect-[3/4] w-full mb-8 overflow-hidden rounded-xl bg-zinc-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium tracking-wide uppercase mb-2 text-zinc-900 font-[var(--theme-heading-font)]">{member.name}</h3>
                <p className="text-zinc-500 font-light uppercase tracking-widest text-sm font-[var(--theme-body-font)]">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
