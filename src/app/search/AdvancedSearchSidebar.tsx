"use client";

import type React from "react";
import { useEffect, useState, useTransition } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Calendar, Filter, Search, User } from "lucide-react";

import { getSearchFilterOptions } from "@/app/actions/search";
import { Button } from "@/components/ui/button";

export function AdvancedSearchSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [arrivalDate, setArrivalDate] = useState(searchParams.get("arrival") || "");
  const [departureDate, setDepartureDate] = useState(searchParams.get("departure") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "2");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || [],
  );

  const [options, setOptions] = useState<{
    categories: { id: string; name: string }[];
  }>({ categories: [] });

  const [isOpen, setIsOpen] = useState(false); // Mobile toggle

  useEffect(() => {
    getSearchFilterOptions().then(setOptions);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (arrivalDate) params.set("arrival", arrivalDate);
    else params.delete("arrival");
    if (departureDate) params.set("departure", departureDate);
    else params.delete("departure");
    if (guests) params.set("guests", guests);
    else params.delete("guests");
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    else params.delete("categories");

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
      setIsOpen(false);
    });
  };

  const handleReset = () => {
    setArrivalDate("");
    setDepartureDate("");
    setGuests("2");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);

    startTransition(() => {
      router.push("/search");
      setIsOpen(false);
    });
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
      {/* Mobile Toggle Header */}
      <div
        className="p-5 flex items-center justify-between lg:hidden cursor-pointer border-b border-zinc-100 bg-zinc-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-zinc-900 font-bold">
          <Filter className="w-5 h-5" />
          <span>Advanced Search</span>
        </div>
        <span className="text-sm font-medium text-zinc-500">{isOpen ? "Hide" : "Show"}</span>
      </div>

      <div className={`p-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        <form onSubmit={handleSearch} className="space-y-8">
          {/* Dates */}
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 tracking-wide">Dates</h3>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => {
                    const newArrival = e.target.value;
                    setArrivalDate(newArrival);
                    if (newArrival && departureDate) {
                      const arrivalD = new Date(newArrival);
                      const departureD = new Date(departureDate);
                      if (arrivalD >= departureD) {
                        const nextDay = new Date(arrivalD);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setDepartureDate(nextDay.toISOString().split("T")[0]);
                      }
                    } else if (newArrival && !departureDate) {
                      const arrivalD = new Date(newArrival);
                      const nextDay = new Date(arrivalD);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setDepartureDate(nextDay.toISOString().split("T")[0]);
                    }
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow appearance-none text-sm"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow appearance-none text-sm"
                  min={
                    arrivalDate
                      ? new Date(new Date(arrivalDate).getTime() + 86400000).toISOString().split("T")[0]
                      : new Date(new Date().getTime() + 86400000).toISOString().split("T")[0]
                  }
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Guests */}
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 tracking-wide">Guests</h3>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow appearance-none text-sm"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900 tracking-wide">Price Range / Night</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-7 pr-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow text-sm"
                />
              </div>
              <span className="text-zinc-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-7 pr-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow text-sm"
                />
              </div>
            </div>
          </div>

          {options.categories.length > 0 && (
            <>
              <hr className="border-zinc-100" />
              <div className="space-y-4">
                <h3 className="font-bold text-zinc-900 tracking-wide">Room Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {options.categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-zinc-300 rounded peer-checked:bg-zinc-900 peer-checked:border-zinc-900 transition-colors" />
                        <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors select-none">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-3 mt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-12 rounded-full font-medium tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isPending ? "Updating..." : "Update Search"}
            </Button>

            <Button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              variant="outline"
              className="w-full h-12 rounded-full font-medium tracking-wide text-zinc-600 border-zinc-200 hover:bg-zinc-50 transition-all"
            >
              Reset Filters
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
