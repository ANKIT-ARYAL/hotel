"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Check, Loader2 } from "lucide-react";

import { type RoomSearchResult, searchAvailableRooms } from "@/app/actions/search";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  initialRooms: RoomSearchResult[];
  totalAvailable: number;
  arrivalStr: string | null;
  departureStr: string | null;
  guestsStr: string | null;
  options?: {
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
  };
}

export function SearchResults({
  initialRooms,
  totalAvailable,
  arrivalStr,
  departureStr,
  guestsStr,
  options,
}: SearchResultsProps) {
  const [rooms, setRooms] = useState<RoomSearchResult[]>(initialRooms);
  const [loading, setLoading] = useState(false);

  const hasMore = rooms.length < totalAvailable;

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await searchAvailableRooms(arrivalStr, departureStr, guestsStr, {
        ...options,
        skip: rooms.length,
        take: 12,
      });

      setRooms((prev) => [...prev, ...result.availableRooms]);
    } catch (err) {
      console.error("Failed to load more rooms", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="h-full">
            <Link
              href={`/booking?roomId=${room.id}&arrival=${arrivalStr}&departure=${departureStr}&guests=${guestsStr}`}
              className="block bg-white group overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-zinc-200"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-zinc-200">
                <img
                  src={room.image || room.category.images[0]?.url || "/uploads/room-1.jpg"}
                  alt={room.category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              <div className="p-8 flex flex-col items-start border border-t-0 border-zinc-100 flex-1 group-hover:border-zinc-200 transition-colors">
                <div className="flex justify-between w-full items-start mb-2">
                  <h3 className="text-2xl tracking-wide line-clamp-1">{room.category.name}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2 py-1">
                    Room {room.number}
                  </span>
                </div>
                <p className="text-zinc-500 font-light mb-8 line-clamp-2 text-sm">
                  {room.description ||
                    room.category.description ||
                    `Enjoy a comfortable stay in our beautiful ${room.category.name}.`}
                </p>

                <div className="w-full flex items-center justify-between border-t border-zinc-100 pt-6 mt-auto">
                  <div className="text-xl text-zinc-900 font-medium">
                    ${room.price}{" "}
                    <span className="text-xs text-zinc-400 uppercase tracking-widest font-normal">/ Night</span>
                  </div>
                  <span className="text-sm tracking-widest uppercase font-medium transition-colors bg-black text-white p-3 hover:bg-zinc-800">
                    Reserve
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            className="h-12 px-10 rounded-full border-zinc-300 font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? "Loading..." : "View More"}
          </Button>
        </div>
      )}
    </div>
  );
}
