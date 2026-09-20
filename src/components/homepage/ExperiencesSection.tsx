"use client";

import React from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { HomepageSettings } from "./types";

interface ExperiencesSectionProps {
  settings: HomepageSettings["experiences"];
}

export function ExperiencesSection({ settings }: ExperiencesSectionProps) {
  if (!settings?.isVisible) return null;

  return (
    <section className="bg-transparent text-zinc-900 py-32 overflow-hidden">
      <div className="px-6 px-6 md:px-12 lg:px-24 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16 relative">
          {/* Text Content (Left) */}
          <div className="w-full lg:w-1/2 z-20 relative pt-12 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-[1px] bg-zinc-400 mr-4" />
                <span className="text-sm font-medium tracking-widest uppercase text-zinc-500">Curated For You</span>
              </div>

              <h1
                className="text-black leading-[1] tracking-tighter mb-8 pr-4 w-1/2"
                style={{ fontSize: "var(--theme-heading-size)" }}
              >
                {settings.title}
              </h1>

              <div
                className="text-zinc-500 font-light text-justify tracking-tighter mb-10 max-w-md prose prose-zinc rich-text"
                style={{ fontSize: "var(--theme-body-size)" }}
                dangerouslySetInnerHTML={{ __html: settings.description }}
              />
              <Link href="/experiences">
                <Button
                  size="lg"
                  className="group bg-zinc-900 text-white hover:bg-zinc-800 h-14 px-8 rounded-full font-medium tracking-wide transition-all duration-500 w-fit shadow-xl shadow-zinc-200"
                >
                  {settings.buttonLabel}
                  <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-2" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image Content (Right, Landscape) */}
          <div className="w-full lg:w-1/2 z-10 flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-zinc-200/50"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={settings.image}
                alt="Experiences"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
