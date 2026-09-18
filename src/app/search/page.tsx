import React from "react";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { searchAvailableRooms } from "@/app/actions/search";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

import { AdvancedSearchSidebar } from "./AdvancedSearchSidebar";
import { SearchResults } from "./SearchResults";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ arrival?: string; departure?: string; categories?: string }>;
}) {
  const { arrival, departure, categories } = await searchParams;
  let catNames = "";
  if (categories) {
    const ids = categories.split(",").filter(Boolean);
    const cats = await prisma.roomCategory.findMany({ where: { id: { in: ids } }, select: { name: true } });
    if (cats.length > 0) catNames = cats.map((c) => c.name).join(", ");
  }

  const format = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };

  if (arrival && departure && catNames) {
    return { title: `Search Results for ${format(arrival)} - ${format(departure)} for ${catNames}` };
  }
  if (arrival && departure) {
    return { title: `Search Results for ${format(arrival)} - ${format(departure)}` };
  }
  if (catNames) {
    return { title: `Search Results for ${catNames}` };
  }
  return { title: "Search Accommodations" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    arrival?: string;
    departure?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
    categories?: string;
  }>;
}) {
  const { arrival, departure, guests, minPrice, maxPrice, categories } = await searchParams;
  const settings = await getHomepageSettings();

  const options = {
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    categories: categories ? categories.split(",").filter(Boolean) : undefined,
  };

  const { availableRooms, totalAvailable, recommendations } = await searchAvailableRooms(
    arrival || null,
    departure || null,
    guests || null,
    options,
  );

  let categoryNames = "";
  if (options.categories && options.categories.length > 0) {
    const selectedCats = await prisma.roomCategory.findMany({
      where: { id: { in: options.categories } },
      select: { name: true },
    });
    if (selectedCats.length > 0) categoryNames = selectedCats.map((c) => c.name).join(", ");
  }

  const formatDisplayDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  const hasSearch = arrival && departure;
  const hasCategories = categoryNames.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* We need a darker navbar background for a light page, or we use a dark header block */}
      <div className="relative h-[80vh] min-h-[600px] max-h-[1000px] 2xl:max-h-[1200px] bg-zinc-900 flex flex-col justify-center items-center pb-12 px-6 lg:px-24 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-50">
          <source src={settings.searchHero?.videoUrl || "/uploads/1789297793949-797680564.mp4"} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 right-0 z-50 h-24 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="relative z-20 max-w-7xl mx-auto w-full text-center mt-24">
          <h1
            className={`text-white mb-4 ${settings.theme.headingFontFamily}`}
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            Explore Our Collections
          </h1>
        </div>
      </div>

      <main className="flex-1 w-full px-6 md:px-12 lg:px-24 py-10">
        <div className="mb-8 text-center lg:text-left lg:ml-[25%] lg:pl-6">
          {hasSearch && hasCategories ? (
            <h2 className={`text-2xl text-zinc-600 ${settings.theme.fontFamily}`}>
              Showing results for Dates: <span className="font-bold text-zinc-900">{formatDisplayDate(arrival)}</span>{" "}
              to <span className="font-bold text-zinc-900">{formatDisplayDate(departure)}</span> for{" "}
              <span className="font-bold text-zinc-900">{categoryNames}</span>
            </h2>
          ) : hasSearch ? (
            <h2 className={`text-2xl text-zinc-600 ${settings.theme.fontFamily}`}>
              Showing results for Dates: <span className="font-bold text-zinc-900">{formatDisplayDate(arrival)}</span>{" "}
              to <span className="font-bold text-zinc-900">{formatDisplayDate(departure)}</span>
            </h2>
          ) : hasCategories ? (
            <h2 className={`text-2xl text-zinc-600 ${settings.theme.fontFamily}`}>
              Showing results for <span className="font-bold text-zinc-900">{categoryNames}</span>
            </h2>
          ) : (
            <h2 className={`text-2xl text-zinc-600 ${settings.theme.fontFamily}`}>
              Showing all available rooms. Select travel dates for precise availability.
            </h2>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 flex-shrink-0">
            <AdvancedSearchSidebar />
          </aside>

          {/* Results Block */}
          <div className="w-full lg:w-3/4">
            {availableRooms.length > 0 && (
              <SearchResults
                key={`${arrival}-${departure}-${guests}-${categories}`}
                initialRooms={availableRooms}
                totalAvailable={totalAvailable}
                arrivalStr={arrival || null}
                departureStr={departure || null}
                guestsStr={guests || null}
                options={options}
              />
            )}

            {/* Empty State - No Availability */}
            {hasSearch && availableRooms.length === 0 && (
              <div className="mb-10 text-center py-16 bg-white rounded-3xl shadow-sm border border-zinc-100">
                <h2 className={`${settings.theme.headingFontFamily} text-4xl text-zinc-900 mb-4`}>
                  No Availability Found
                </h2>
                <p className={`text-zinc-500 ${settings.theme.fontFamily} max-w-lg mx-auto mb-8`}>
                  We are sorry, but we are fully booked for those exact dates. Please consider adjusting your travel
                  dates or explore our recommended collections below.
                </p>
                <Link href="/search">
                  <Button variant="outline" className="h-12 px-8 rounded-full border-zinc-300">
                    Change Search Dates
                  </Button>
                </Link>
              </div>
            )}

            {/* Empty State - No Search and No Rooms */}
            {!hasSearch && availableRooms.length === 0 && (
              <div className="mb-10 text-center py-16 bg-white rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center justify-center min-h-[300px]">
                <h2 className={`${settings.theme.headingFontFamily} text-3xl text-zinc-900 mb-4`}>
                  Discover Your Next Stay
                </h2>
                <p className={`text-zinc-500 ${settings.theme.fontFamily} max-w-md mx-auto`}>
                  Please select your preferences in the sidebar to explore our collections.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Section (Full width at bottom) */}
        {recommendations.length > 0 && (
          <div className="mt-16 pt-16 border-t border-zinc-100">
            <h2 className={`${settings.theme.headingFontFamily} text-3xl md:text-4xl text-zinc-900 mb-10 text-center`}>
              {hasSearch && availableRooms.length === 0 ? "Highly Recommended Alternatives" : "Featured Collections"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((category) => (
                <div key={category.id} className="h-full">
                  <Link
                    href={`/rooms-and-suites/${category.slug || category.id}`}
                    className="block bg-white group overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-zinc-200"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-zinc-200">
                      <img
                        src={category.images[0]?.url || "/uploads/room-1.jpg"}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-8 flex flex-col items-start border border-t-0 border-zinc-100 flex-1 group-hover:border-zinc-200 transition-colors">
                      <h3 className={`${settings.theme.headingFontFamily} text-2xl tracking-wide mb-2 line-clamp-1`}>
                        {category.name}
                      </h3>
                      <p className={`text-zinc-500 font-light mb-8 line-clamp-2 text-sm ${settings.theme.fontFamily}`}>
                        {category.description || `Discover the luxurious ${category.name}.`}
                      </p>

                      <div className="w-full flex items-center justify-between border-t border-zinc-100 pt-6 mt-auto">
                        <div className={`text-xl text-zinc-900 font-medium ${settings.theme.fontFamily}`}>
                          ${category.basePrice}{" "}
                          <span className="text-xs text-zinc-400 uppercase tracking-widest font-normal">/ Night</span>
                        </div>
                        <span className="text-sm tracking-widest uppercase font-medium transition-colors bg-black text-white p-3 hover:bg-zinc-800">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
