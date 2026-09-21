"use client";
import { sanitizeHtml } from "@/lib/sanitize";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Amenity, Image as PrismaImage, Room, RoomCategory } from "@prisma/client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Bath, Bed, Coffee, type LucideIcon, Tv, Wifi, Wind } from "lucide-react";

import { defaultRoomsPageSettings, type RoomsPageSettings } from "@/components/rooms/types";

type RoomCategoryWithRelations = RoomCategory & {
  images: PrismaImage[];
  amenities: Amenity[];
  rooms: Room[];
};

interface RoomDetailsProps {
  room: RoomCategoryWithRelations;
  settings?: RoomsPageSettings;
}

export function RoomDetails({ room, settings = defaultRoomsPageSettings }: RoomDetailsProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const coverImage = room.images && room.images.length > 0 ? room.images[0].url : null;

  const galleryImages = room.images && room.images.length > 1 ? room.images.slice(1) : [];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (galleryImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const getSlideImages = (step: number) => {
    if (galleryImages.length === 0) return [];
    const cycle = Math.floor(step / 2);
    const remainder = step % 2;
    const baseImgIndex = (cycle * 3) % galleryImages.length;

    if (remainder === 0) {
      const img1 = galleryImages[baseImgIndex % galleryImages.length];
      const img2 = galleryImages[(baseImgIndex + 1) % galleryImages.length];
      return [img1, img2].filter(Boolean);
    }
    const img1 = galleryImages[(baseImgIndex + 2) % galleryImages.length];
    return [img1].filter(Boolean);
  };

  const currentImages = getSlideImages(currentStep);

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[80vh] w-full overflow-hidden bg-zinc-900">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/40 z-10" />
          {settings.detailsHero.videoUrl ? (
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
              <source src={settings.detailsHero.videoUrl} type="video/mp4" />
            </video>
          ) : settings.detailsHero.image ? (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${settings.detailsHero.image})` }}
            />
          ) : null}
        </motion.div>

        {/* Back Link */}
        <div className="absolute top-32 left-6 md:left-12 lg:left-24 z-50">
          <Link
            href="/rooms-and-suites"
            className="relative z-50 pointer-events-auto text-white hover:text-white/70 transition-colors uppercase tracking-widest font-medium flex items-center gap-2"
            style={{ fontSize: "var(--theme-body-size)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Accommodations
          </Link>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-light tracking-wider mb-6"
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            {room.name}
          </motion.h1>
        </div>
      </section>

      {/* Details Section - Editorial Layout */}
      <section className="py-24 px-6 md:px-12 lg:px-24 ">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 flex flex-col"
          >
            <h2 className="text-4xl text-zinc-900 tracking-wide mb-2">The Experience</h2>
            <div className="w-12 h-[1px] bg-zinc-900 mb-8" />

            <p className="text-zinc-600 text-justify tracking-tighter font-light mb-12"
            style={{ fontSize: "var(--theme-body-size)" }}
            >
              {room.description ||
                "Immerse yourself in our beautifully appointed rooms, designed to offer the perfect blend of modern luxury and timeless elegance. Enjoy a restful stay with premium amenities and stunning views."}
            </p>

            <div className="flex flex-col gap-4 text-sm text-zinc-500 uppercase tracking-widest font-medium mt-auto">
              {room.size && (
                <div className="flex justify-between border-b border-zinc-100 pb-3">
                  <span>Size</span>
                  <span className="text-zinc-900">{room.size}</span>
                </div>
              )}
              {room.occupancy && (
                <div className="flex justify-between border-b border-zinc-100 pb-3">
                  <span>Occupancy</span>
                  <span className="text-zinc-900">Up to {room.occupancy} Guests</span>
                </div>
              )}
              {room.bedType && (
                <div className="flex justify-between border-b border-zinc-100 pb-3">
                  <span>Bed</span>
                  <span className="text-zinc-900">{room.bedType}</span>
                </div>
              )}
              <div className="flex justify-between pb-3">
                <span>Starting Rate</span>
                <span className="text-zinc-900">${room.basePrice} / Night</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-7/12 relative flex flex-col"
          >
            {/* Main Image */}
            <div className="w-full flex-1 relative min-h-[400px] lg:min-h-[500px] bg-zinc-100 overflow-hidden">
              <Image src={coverImage || "/uploads/room-1.jpg"} alt={room.name} fill className="object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Carousel */}
      {galleryImages.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 pb-24 overflow-hidden relative min-h-[40vh] md:min-h-[60vh] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} className="w-full flex gap-6 md:gap-12">
              {currentImages.length === 2 ? (
                <>
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-1/2 aspect-[4/3] relative rounded-sm overflow-hidden bg-zinc-100 group"
                  >
                    <Image
                      src={currentImages[0].url}
                      alt="Gallery image"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="w-1/2 aspect-[4/3] relative rounded-sm overflow-hidden bg-zinc-100 group"
                  >
                    <Image
                      src={currentImages[1].url}
                      alt="Gallery image"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full aspect-[16/9] md:aspect-[21/9] relative rounded-sm overflow-hidden bg-zinc-100 group"
                >
                  <Image
                    src={currentImages[0]?.url}
                    alt="Gallery image"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* Available Rooms Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-50">
        <div className="">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl tracking-wide text-zinc-900 mb-4">Available Units</h2>
              <p className="text-zinc-500 font-light text-lg">
                Select your specific room from our {room.name} collection.
              </p>
            </div>

            {/* Amenities for Category */}
            {settings?.amenitiesSection?.isVisible && (
              <div className="flex flex-wrap justify-end gap-6 items-center">
                {room.amenities.map((amenity) => {
                  const nameLower = amenity.name.toLowerCase();
                  let Icon = Bed;
                  if (nameLower.includes("wifi") || nameLower.includes("internet")) Icon = Wifi;
                  else if (nameLower.includes("tv") || nameLower.includes("television")) Icon = Tv;
                  else if (nameLower.includes("coffee") || nameLower.includes("tea")) Icon = Coffee;
                  else if (nameLower.includes("air") || nameLower.includes("ac")) Icon = Wind;
                  else if (nameLower.includes("bath") || nameLower.includes("shower") || nameLower.includes("tub"))
                    Icon = Bath;

                  return (
                    <div key={amenity.id} className="flex items-center gap-2 text-zinc-500 group">
                      <Icon className="w-5 h-5 text-zinc-900 stroke-[1.5]" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {room.rooms && room.rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {room.rooms.map((individualRoom, i) => {
                // Use gallery images circularly, fallback to coverImage, or placeholder
                const imgUrl =
                  galleryImages.length > 0
                    ? galleryImages[i % galleryImages.length].url
                    : coverImage || "/uploads/room-1.jpg";

                return (
                  <motion.div
                    key={individualRoom.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="h-full"
                  >
                    <Link
                      href={`/rooms-and-suites/${room.slug}/${individualRoom.number}`}
                      className="block bg-white group overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-zinc-200"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden bg-zinc-200">
                        <Image
                          src={imgUrl}
                          alt={`Room ${individualRoom.number}`}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-8 flex flex-col items-start border border-t-0 border-zinc-100 flex-1 group-hover:border-zinc-200 transition-colors">
                        <h3 className="text-2xl tracking-wide mb-2">{individualRoom.name || `Room ${individualRoom.number}`}</h3>
                        <p className="text-zinc-500 font-light mb-8 line-clamp-2 text-justify tracking-tighter"
                        >
                          {individualRoom.description ||
                            `Enjoy a comfortable stay in our beautiful Room ${individualRoom.number}.`}
                        </p>

                        <div className="w-full flex items-center justify-between border-t border-zinc-100 pt-6 mt-auto">
                          <div className="text-xl text-zinc-900 font-medium">
                            ${individualRoom.price}{" "}
                            <span className="text-xs text-zinc-400 uppercase tracking-widest font-normal">/ Night</span>
                          </div>
                          <span className="text-sm tracking-widest uppercase font-medium transition-colors bg-black text-white p-3">
                            Reserve
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-zinc-500 py-16 bg-white border border-zinc-100">
              <p className="text-lg font-light">No individual rooms are currently listed for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Booking CTA Section */}
      {settings?.bookingCta?.isVisible && (
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {settings.bookingCta.image ? (
              <Image src={settings.bookingCta.image} alt="Booking CTA" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-900" />
            )}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 w-full mx-auto text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif mb-6"
            >
              {settings.bookingCta.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-zinc-300 mb-10 font-light rich-text"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.bookingCta.description) }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/book"
                className="inline-flex h-14 items-center justify-center bg-white px-10 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
              >
                {settings.bookingCta.buttonLabel}
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
