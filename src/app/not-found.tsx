import React from "react";

import Link from "next/link";

import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found | Hotel Luxury",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col w-full">
        <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0">
            <img
              src="https://images.unsplash.com/photo-1542314831-c6a4d27160c9?q=80&w=2825&auto=format&fit=crop"
              alt="404 Not Found"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>

          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
            <h1
              className="text-white mb-6 tracking-tight leading-tight"
              style={{ fontSize: "var(--theme-heading-size)", textTransform: "uppercase" }}
            >
              404 - Page Not Found
            </h1>

            <p className="text-white/90 text-lg md:text-2xl font-light mb-12">
              We could not find the page you are looking for.
            </p>

            <Link href="/">
              <Button
                size="lg"
                className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-none px-8 py-6 text-lg uppercase tracking-wider"
              >
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
