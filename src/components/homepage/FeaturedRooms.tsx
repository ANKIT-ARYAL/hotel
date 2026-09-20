/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Info } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";



import type { HomepageSettings } from "./types";
import "swiper/css";

import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FeaturedRoomsProps {
  settings: HomepageSettings["featuredRooms"];
  categories?: any[]; // Passed from page.tsx
}

export function FeaturedRooms({ settings, categories = [] }: FeaturedRoomsProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  const tabs = ["All", "Room", "Suite", "Townhouse", "Flagship"];

  const scrollLeft = () => swiperInstance?.slidePrev();
  const scrollRight = () => swiperInstance?.slideNext();

  const filteredRooms = categories.filter((category) => {
    if (activeTab === "All") return true;
    return category.name.toLowerCase().includes(activeTab.toLowerCase());
  });

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
          <h1
            className="text-black leading-[1] tracking-tighter mb-8 pr-4 w-1/2"
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            {settings.title}
          </h1>
          <p className="text-black/80 mb-6" style={{ fontSize: "var(--theme-body-size)" }}>
            {settings.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-8 mb-12 text-zinc-500 font-light">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-zinc-400 p-0.5">
                <Check className="text-zinc-600" strokeWidth={3} />
              </div>
              <span className="text-black/80 max-w-lg font-light" style={{ fontSize: "var(--theme-body-size)" }}>
                The price shown is for one night, today
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-zinc-400 p-0.5">
                <Check className="text-zinc-600" strokeWidth={3} />
              </div>
              <span className="text-black/80 max-w-lg font-light" style={{ fontSize: "var(--theme-body-size)" }}>
                Member rates & promotions at the next step
              </span>
            </div>
          </div>

          <div className="border-b border-zinc-200">
            <div className="flex overflow-x-auto gap-8 hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    swiperInstance?.slideTo(0);
                  }}
                  className={`pb-4 text-xl font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === tab ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a8824f]" />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <Swiper
            key={activeTab} // Force re-mount when tabs change to reset swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView="auto"
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={filteredRooms.length > 2}
            onSwiper={setSwiperInstance}
            className="w-full !pb-12"
          >
            {filteredRooms.map((room) => (
              <SwiperSlide key={room.id} className="!w-[85vw] sm:!w-[400px] flex flex-col group !h-auto">
                <div className="flex flex-col h-full">
                  <div className="aspect-[4/3] w-full mb-6 overflow-hidden bg-zinc-100">
                    <img
                      src={room.images?.[0]?.url || "/placeholder.jpg"}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-lg font-medium tracking-widest text-zinc-900 uppercase mb-3">{room.name}</h3>

                  <p className="text-base text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
                    {room.amenities?.map((a: any) => a.name).join(" • ") || "Standard Amenities"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8 mt-auto">
                    <Info className="w-4 h-4" />
                    <span>Check rates at the next step*</span>
                  </div>

                  <div className="flex items-center gap-6 mt-auto">
                    <Link
                      href={`/search?categories=${room.id}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-none bg-black hover:bg-zinc-800 text-white px-3 py-4 h-auto text-base font-medium transition-colors"
                    >
                      Choose this room
                    </Link>
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="text-base text-zinc-600 hover:text-black underline underline-offset-4 decoration-zinc-300 hover:decoration-black transition-colors"
                    >
                      View room details
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {filteredRooms.length === 0 && (
              <div className="py-20 text-center text-zinc-500">No rooms found in this category.</div>
            )}
          </Swiper>
        </div>

        <div className="flex items-center justify-between mt-8 border-t border-zinc-200 pt-8">
          <p className="text-sm text-zinc-500 underline underline-offset-2">*See rate conditions</p>
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

      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedRoom(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-6xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-zinc-100">
                <Swiper
                  modules={[Autoplay, Navigation]}
                  autoplay={{ delay: 2000, disableOnInteraction: false }}
                  loop={true}
                  className="w-full h-full"
                >
                  {selectedRoom.images && selectedRoom.images.length > 0 ? (
                    selectedRoom.images.map((img: any, i: number) => (
                      <SwiperSlide key={i} className="w-full h-full">
                        <img src={img.url} alt={selectedRoom.name} className="w-full h-full object-cover" />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide className="w-full h-full">
                      <img src="/placeholder.jpg" alt={selectedRoom.name} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative overflow-hidden">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-500" />
                </button>

                <h2 className="text-3xl font-medium tracking-wide text-zinc-900 uppercase mb-4 mt-4 md:mt-0">
                  {selectedRoom.name}
                </h2>

                <div className="text-2xl font-light text-zinc-600 mb-6">
                  From ${selectedRoom.basePrice}{" "}
                  <span className="text-sm uppercase tracking-widest text-zinc-400">/ Night</span>
                </div>

                <p className="text-zinc-600 mb-8 text-justify tracking-[-0.075rem] line-clamp-[7]" style={{ fontSize: "var(--theme-body-size)" }}>{selectedRoom.description}</p>

                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-widest font-bold text-zinc-900 mb-4">Room Amenities</h4>
                  <ul className="grid grid-cols-2 gap-y-3 text-zinc-600">
                    {selectedRoom.amenities?.map((amenity: any) => (
                      <li key={amenity.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#a8824f]" />
                        {amenity.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8 flex flex-col gap-4">
                  <Link
                    href={`/rooms-and-suites/${selectedRoom.slug || selectedRoom.id}`}
                    className="w-full inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white px-6 py-4 text-base font-medium transition-colors"
                  >
                    View more details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
