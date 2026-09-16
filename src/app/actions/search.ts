'use server';

import prisma from '@/lib/db';
import { RoomCategory, Image, Amenity } from '@prisma/client';

export type SearchResult = RoomCategory & {
  images: Image[];
  amenities: Amenity[];
};

export async function searchAvailableRooms(
  arrivalStr: string | null,
  departureStr: string | null,
  guestsStr: string | null
): Promise<{ available: SearchResult[]; recommendations: SearchResult[] }> {
  
  // If dates are missing, just return recommendations
  if (!arrivalStr || !departureStr) {
    const recommendations = await getRecommendations();
    return { available: [], recommendations };
  }

  const arrival = new Date(arrivalStr);
  const departure = new Date(departureStr);

  // Validate dates
  if (isNaN(arrival.getTime()) || isNaN(departure.getTime()) || arrival >= departure) {
    const recommendations = await getRecommendations();
    return { available: [], recommendations };
  }

  // Find all categories that have AT LEAST ONE room with NO overlapping active bookings
  const availableCategories = await prisma.roomCategory.findMany({
    where: {
      rooms: {
        some: {
          status: 'AVAILABLE',
          bookings: {
            none: {
              AND: [
                { checkIn: { lt: departure } },
                { checkOut: { gt: arrival } },
                { status: { not: 'CANCELLED' } }
              ]
            }
          }
        }
      }
    },
    include: {
      images: true,
      amenities: true
    }
  });

  if (availableCategories.length > 0) {
    return { available: availableCategories, recommendations: [] };
  }

  // If no rooms available, fetch recommendations (just all categories for now)
  const recommendations = await getRecommendations();
  return { available: [], recommendations };
}

async function getRecommendations() {
  // Fetch a few top categories as recommendations
  return prisma.roomCategory.findMany({
    take: 3,
    orderBy: { basePrice: 'desc' }, // Recommend luxury first
    include: {
      images: true,
      amenities: true
    }
  });
}
