"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";

import type { HomepageSettings } from "./types";

interface LoaderProps {
  settings: HomepageSettings["loader"];
}

export function Loader({ settings }: LoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time, or wait for assets to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            {settings.iconUrl && <img src={settings.iconUrl} alt="Loading" className="h-16 w-auto invert" />}
            {!settings.iconUrl && (
              <div className="font-argine text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-widest animate-pulse">
                HOTEL LUXURY
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
