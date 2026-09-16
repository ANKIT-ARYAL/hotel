'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HomepageSettings } from './types';
import { Button } from '@/components/ui/button';
import { Check, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

interface FeaturedRoomsProps {
  settings: HomepageSettings['featuredRooms'];
}

export function FeaturedRooms({ settings }: FeaturedRoomsProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  
  const tabs = ['All', 'Room', 'Suite', 'Family', 'Club Millésime', 'Accessible'];

  const scrollLeft = () => {
    swiperInstance?.slidePrev();
  };

  const scrollRight = () => {
    swiperInstance?.slideNext();
  };

  return (
    <section className="py-24 bg-transparent">
      <div className="px-6 md:px-12 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="font-argine text-black text-5xl md:text-6xl lg:text-[5.5rem] tracking-tighter mb-8">
            {settings.title}
          </h2>
          <p className="text-black/80 max-w-lg font-light prose prose-invert text-xl mb-6">
            {settings.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-8 mb-12 text-zinc-500 font-light">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-zinc-400 p-0.5">
                <Check className="text-zinc-600" strokeWidth={3} />
              </div>
              <span className='text-md text-black/80 max-w-lg font-light prose prose-invert text-xl'>The price shown is for one night, today</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="rounded-full border border-zinc-400 p-0.5">
                <Check className="text-zinc-600" strokeWidth={3} />
              </div>
              <span className='text-md text-black/80 max-w-lg font-light prose prose-invert text-xl'>Member rates & promotions at the next step</span>
            </div>
          </div>

          <div className="border-b border-zinc-200">
            <div className="flex overflow-x-auto gap-8 hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xl font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === tab ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a8824f]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView="auto"
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={true}
            onSwiper={setSwiperInstance}
            className="w-full !pb-12"
          >
            {settings.rooms.map((room) => (
              <SwiperSlide 
                key={room.id} 
                className="!w-[85vw] sm:!w-[400px] flex flex-col group h-auto"
              >
                <div className="flex flex-col h-full">
                  <div className="aspect-[4/3] w-full mb-6 overflow-hidden bg-zinc-100">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  <h3 className="text-lg font-medium tracking-widest text-zinc-900 uppercase mb-3">
                    {room.name}
                  </h3>
                  
                  <p className="text-base text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
                    {room.amenities.join(' • ')}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-auto">
                    <Info className="w-4 h-4" />
                    <span>Check rates at the next step*</span>
                  </div>

                  <div className="flex items-center gap-6 mt-auto">
                    <Button className="bg-black hover:bg-zinc-800 text-white rounded-none px-3 py-4 h-auto text-base font-medium transition-colors">
                      Choose this room
                    </Button>
                    <Link href="#" className="text-base text-zinc-600 hover:text-black underline underline-offset-4 decoration-zinc-300 hover:decoration-black transition-colors">
                      View room details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex items-center justify-between mt-8 border-t border-zinc-200 pt-8">
          <p className="text-sm text-zinc-500 underline underline-offset-2">
            *See rate conditions
          </p>
          <div className="flex items-center gap-4 text-base text-zinc-500">
            <button 
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
