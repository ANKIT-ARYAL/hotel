"use server";

import type { Amenity, Image, Room, RoomCategory } from "@prisma/client";

import prisma from "@/lib/db";

export type SearchResult = RoomCategory & {
  images: Image[];
  amenities: Amenity[];
};

export type RoomSearchResult = Room & {
  category: RoomCategory & {
    images: Image[];
    amenities: Amenity[];
  };
};

export async function searchAvailableRooms(
  arrivalStr: string | null,
  departureStr: string | null,
  guestsStr: string | null,
  options?: {
    skip?: number;
    take?: number;
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
  },
): Promise<{ availableRooms: RoomSearchResult[]; totalAvailable: number; recommendations: SearchResult[] }> {
  const skip = options?.skip || 0;
  const take = options?.take || 12;

  // Base where clause for availability
  const whereClause: any = {};

  if (arrivalStr && departureStr) {
    const arrival = new Date(arrivalStr);
    const departure = new Date(departureStr);

    // Only apply booking date filters if valid dates are provided
    if (!isNaN(arrival.getTime()) && !isNaN(departure.getTime()) && arrival < departure) {
      whereClause.bookings = {
        none: {
          AND: [{ checkIn: { lt: departure } }, { checkOut: { gt: arrival } }, { status: { not: "CANCELLED" } }],
        },
      };
    }
  }

  // Add guest filtering
  if (guestsStr) {
    const guestsCount = parseInt(guestsStr, 10);
    if (!isNaN(guestsCount)) {
      whereClause.category = {
        ...whereClause.category,
        occupancy: {
          gte: guestsCount,
        },
      };
    }
  }

  // Add advanced filters
  if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
    whereClause.price = {};
    if (options.minPrice !== undefined) whereClause.price.gte = options.minPrice;
    if (options.maxPrice !== undefined) whereClause.price.lte = options.maxPrice;
  }

  if (options?.categories && options.categories.length > 0) {
    whereClause.categoryId = {
      in: options.categories,
    };
  }

  const totalAvailable = await prisma.room.count({
    where: whereClause,
  });

  const availableRooms = await prisma.room.findMany({
    where: whereClause,
    skip,
    take,
    include: {
      category: {
        include: {
          images: true,
          amenities: true,
        },
      },
    },
    orderBy: {
      price: "asc",
    },
  });

  if (availableRooms.length > 0) {
    return { availableRooms, totalAvailable, recommendations: [] };
  }

  // If no rooms available, fetch recommendations
  const recommendations = await getRecommendations();
  return { availableRooms: [], totalAvailable: 0, recommendations };
}

async function getRecommendations() {
  // Fetch a few top categories as recommendations
  return prisma.roomCategory.findMany({
    take: 3,
    orderBy: { basePrice: "desc" }, // Recommend luxury first
    include: {
      images: true,
      amenities: true,
    },
  });
}

export async function getSearchFilterOptions() {
  const categories = await prisma.roomCategory.findMany({
    select: { id: true, name: true },
  });

  return { categories };
}
