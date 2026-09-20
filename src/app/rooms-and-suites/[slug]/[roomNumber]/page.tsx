import React from "react";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { getPaymentSettings } from "@/app/actions/payment-settings";
import { getRoomsPageSettings } from "@/app/actions/rooms-page-settings";
import { Navbar } from "@/components/homepage/Navbar";
import { BookingForm } from "@/components/rooms/BookingForm";
import { RoomGallery } from "@/components/rooms/RoomGallery";
import prisma from "@/lib/db";

export default async function RoomDetailsPage({ params }: { params: Promise<{ slug: string; roomNumber: string }> }) {
  const { slug, roomNumber } = await params;

  const room = await prisma.room.findFirst({
    where: {
      number: roomNumber,
      category: {
        slug: slug,
      },
    },
    include: {
      category: {
        include: {
          images: true,
          amenities: true,
        },
      },
    },
  });

  if (!room) {
    notFound();
  }

  const settings = await getHomepageSettings();
  const roomsSettings = await getRoomsPageSettings();
  const paymentSettings = await getPaymentSettings();

  const roomNumberHash = parseInt(room.number) || 1;
  const galleryImages = [
    { id: "img-1", url: `/uploads/unique-room-${(roomNumberHash % 5) + 1}.jpg` },
    { id: "img-2", url: `/uploads/unique-room-${((roomNumberHash + 1) % 5) + 1}.jpg` },
    { id: "img-3", url: `/uploads/unique-room-${((roomNumberHash + 2) % 5) + 1}.jpg` },
  ];

  // Fetch 3 other categories for "Explore More"
  const featuredCategories = await prisma.roomCategory.findMany({
    where: {
      NOT: {
        id: room.categoryId,
      },
    },
    take: 3,
    include: {
      images: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[80vh] min-h-[600px] max-h-[1000px] 2xl:max-h-[1200px] flex flex-col justify-end bg-zinc-900 overflow-hidden pb-12 px-6 lg:px-24">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40">
          <source
            src={roomsSettings.detailsHero?.videoUrl || "/uploads/1789301378477-596276179.mp4"}
            type="video/mp4"
          />
        </video>
        <div className="absolute top-0 left-0 right-0 z-50 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="relative z-20 mt-12 flex flex-col gap-4">
          <Link
            href={`/rooms-and-suites/${slug}`}
            className="text-zinc-400 hover:text-white transition-colors uppercase tracking-widest  font-medium flex items-center gap-2"
            style={{ fontSize: "var(--theme-body-size)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            BACK TO CATEGORY
          </Link>
          <h1
            className="text-white"
            style={{ fontFamily: "var(--theme-heading-font)", fontSize: "var(--theme-heading-size)" }}
          >
            {room.name || `Room ${room.number}`}
          </h1>
          <p className="text-zinc-300 font-light text-justify tracking-tighter max-w-2xl text-lg"
          style={{ fontSize: "var(--theme-body-size)" }}
          >
          {room.description}
          </p>
        </div>
      </div>

      <main className="flex-1 w-full px-6 md:px-12 lg:px-24 py-8 md:py-16 flex flex-col gap-8">
        {/* Stats Grid - Top */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-b border-zinc-100">
              {room.category.size && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium"
                  style={{ fontSize: "var(--theme-body-size)" }}>Size</span>
                  <span className="text-sm font-medium text-zinc-900"
                  style={{ fontSize: "var(--theme-body-size)" }}>{room.category.size}</span>
                </div>
              )}
              {room.category.occupancy && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium"
                  style={{ fontSize: "var(--theme-body-size)" }}>Occupancy</span>
                  <span className="text-sm font-medium text-zinc-900"
                  style={{ fontSize: "var(--theme-body-size)" }}>Up to {room.category.occupancy}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content & Form Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Content */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <RoomGallery images={galleryImages} altPrefix={`Room ${room.number}`} />

            <div className="mt-4">
              <h2 className="text-4xl tracking-wide text-zinc-900 mb-6">
                About this Room
              </h2>
              <p className="text-zinc-600 font-light text-justify tracking-tighter"
              style={{ fontSize: "var(--theme-body-size)" }}
              >
                {room.description ||
                  `Experience the pinnacle of comfort in Room ${room.number}. Specifically designed as part of our ${room.category.name} collection, this unit offers spectacular styling and a restful environment for your stay.`}
              </p>
            </div>
          </div>

          {/* Right Content - Booking Form */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <BookingForm
                roomId={room.id}
                roomNumber={room.number}
                price={room.price}
                paymentSettings={paymentSettings}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Package Inclusions Section */}
      <section className="bg-zinc-50 py-24 px-6 md:px-12 lg:px-24 border-t border-zinc-100">
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="text-4xl tracking-wide text-zinc-900 mb-4">Package Inclusions</h2>
            <p className="text-zinc-500 font-light text-justify tracking-tighter max-w-2xl"
            style={{ fontSize: "var(--theme-body-size)" }}
            >
              Everything you need for an unforgettable stay. Your reservation in the {room.category.name} includes the
              following complimentary amenities and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {room.category.amenities && room.category.amenities.length > 0
              ? room.category.amenities.map((amenity, idx) => {
                  let imgUrl = `/uploads/unique-room-${(idx % 5) + 1}.jpg`;
                  const name = amenity.name.toLowerCase();

                  if (name.includes("parking") || name.includes("valet")) {
                    imgUrl = "/uploads/exterior.jpg";
                  } else if (name.includes("wifi") || name.includes("internet")) {
                    imgUrl = "/uploads/room-2.jpg";
                  } else if (name.includes("pool") || name.includes("swim")) {
                    imgUrl = "/uploads/room-3.jpg";
                  } else if (name.includes("breakfast") || name.includes("dining")) {
                    imgUrl = "/uploads/unique-room-2.jpg";
                  } else if (name.includes("ac") || name.includes("climate") || name.includes("air")) {
                    imgUrl = "/uploads/room-1.jpg";
                  } else if (name.includes("gym") || name.includes("fitness")) {
                    imgUrl = "/uploads/unique-room-4.jpg";
                  }

                  return (
                    <div key={amenity.id || idx} className="flex flex-col gap-4 group">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-200">
                        <Image
                          src={imgUrl}
                          alt={amenity.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"                          
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 uppercase tracking-widest text-lg mb-1">                        
                          {amenity.name}
                        </h4>
                        <p className="text-sm font-light text-zinc-500 line-clamp-2"
                        style={{ fontSize: "var(--theme-body-size)" }}>
                          Included complimentary with your stay.
                        </p>
                      </div>
                    </div>
                  );
                })
              : [
                  {
                    name: "High-Speed Wi-Fi",
                    img: "/uploads/room-2.jpg",
                    desc: "Stay connected with complimentary high-speed internet access.",
                  },
                  {
                    name: "Valet Parking",
                    img: "/uploads/exterior.jpg",
                    desc: "Secure valet parking included for one vehicle per room.",
                  },
                  {
                    name: "Daily Breakfast",
                    img: "/uploads/unique-room-2.jpg",
                    desc: "Enjoy a complimentary gourmet breakfast buffet every morning.",
                  },
                  {
                    name: "Climate Control",
                    img: "/uploads/room-1.jpg",
                    desc: "Personalized AC and climate control for your ultimate comfort.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-4 group">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-200">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 uppercase tracking-widest text-xs mb-1">{item.name}</h4>
                      <p className="text-sm font-light text-zinc-500 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Explore More Section */}
      {featuredCategories.length > 0 && (
        <section className="bg-white py-24 px-6 lg:px-24 border-t border-zinc-100">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl tracking-wide text-zinc-900 mb-4">Explore More Accommodations</h2>
                <p className="text-zinc-500 font-light"
                style={{ fontSize: "var(--theme-body-size)" }}>
                  Discover our other beautifully appointed rooms and suites.
                </p>
              </div>
              <Link
                href="/rooms-and-suites"
                className="text-xs uppercase tracking-widest font-medium border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
                style={{ fontSize: "var(--theme-body-size)" }}
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/rooms-and-suites/${category.slug}`}
                  className="group flex flex-col gap-4"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100">
                    <Image
                      src={category.images.length > 0 ? category.images[0].url : "/uploads/room-1.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl text-zinc-900 mb-1 group-hover:text-zinc-600 transition-colors py-2">
                      {category.name}
                    </h3>
                    <p className="text-zinc-500 font-light text-justify tracking-tighter line-clamp-2"
                    style={{ fontSize: "var(--theme-body-size)" }}
                    >
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
