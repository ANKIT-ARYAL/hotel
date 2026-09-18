"use client";

import React from "react";

import Image from "next/image";

import { motion, useScroll, useTransform } from "framer-motion";

import type { SpaPageSettings } from "./types";

interface SpaFacilitiesSectionProps {
  settings: SpaPageSettings["facilities"];
}

export function SpaFacilitiesSection({ settings }: SpaFacilitiesSectionProps) {
  if (!settings.isVisible) return null;

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="font-medium tracking-tight text-zinc-900 mb-6"
          style={{
            fontFamily: "var(--theme-heading-font)",
            fontSize: settings.typography?.titleSize || "var(--theme-heading-size)",
          }}
        >
          {settings.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed"
          style={{ fontSize: settings.typography?.bodySize || "var(--theme-body-size)" }}
        >
          {settings.description}
        </motion.p>
      </div>

      <div className="space-y-40">
        {settings.items.map((facility, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={facility.id}
              className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-16 lg:gap-24`}
            >
              {/* Image Collage */}
              <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-[700px]">
                {facility.images && facility.images.length > 0 ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-0 left-0 w-3/4 h-[80%] z-10 overflow-hidden"
                    >
                      <Image
                        src={facility.images[0]}
                        alt={facility.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </motion.div>

                    {facility.images[1] && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="absolute bottom-0 right-0 w-2/3 h-[60%] z-20 shadow-2xl overflow-hidden"
                      >
                        <Image
                          src={facility.images[1]}
                          alt={`${facility.name} detail`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </motion.div>
                    )}

                    {facility.images[2] && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="absolute top-1/4 -right-12 w-1/3 h-[40%] z-0 hidden lg:block overflow-hidden opacity-80"
                      >
                        <Image src={facility.images[2]} alt={`${facility.name} detail`} fill className="object-cover" />
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-zinc-100 flex items-center justify-center text-zinc-400">
                    No images provided
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2 space-y-8">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl lg:text-4xl font-medium tracking-tight text-zinc-900"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                >
                  {facility.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-zinc-500 font-light leading-relaxed text-lg text-justify"
                >
                  {facility.description}
                </motion.p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
