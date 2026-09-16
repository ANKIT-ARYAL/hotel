'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomGalleryProps {
  images: { id: string; url: string }[];
  altPrefix: string;
}

export function RoomGallery({ images, altPrefix }: RoomGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] w-full bg-zinc-200 flex items-center justify-center text-zinc-400 rounded-sm">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[400px] md:h-[500px]">
      {/* Thumbnails Strip (Left) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-32 shrink-0 hide-scrollbar pb-2 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-[4/3] md:w-full w-24 shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-300 ${activeIndex === idx ? 'border-zinc-900 shadow-md scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <Image 
              src={img.url} 
              alt={`${altPrefix} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image (Right) */}
      <div className="relative flex-1 rounded-sm overflow-hidden bg-zinc-100 shadow-xl shadow-zinc-200/50 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image 
              src={images[activeIndex].url}
              alt={`${altPrefix} view ${activeIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
