'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomepageSettings } from './types';
import Image from 'next/image';

interface LoaderProps {
  settings: HomepageSettings['loader'];
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
            {settings.iconUrl && (
              <img src={settings.iconUrl} alt="Loading" className="h-16 w-auto invert" />
            )}
            {!settings.iconUrl && (
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
