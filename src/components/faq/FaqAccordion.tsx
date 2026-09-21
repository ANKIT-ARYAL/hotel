"use client";

import React, { useState } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import type { FaqItem } from "./types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-zinc-200 pb-2 text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]">
            <button
              onClick={() => toggle(index)}
              className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
            >
              <span className="font-medium text-zinc-900 pr-8">{item.question}</span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-zinc-500 transition-transform duration-200 shrink-0",
                  isOpen && "transform rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0",
              )}
            >
              <p className="text-zinc-600 font-light leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
