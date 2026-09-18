import React from "react";

import type { Metadata } from "next";

import { getFaqPageSettings } from "@/app/actions/faq-page-settings";
import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs | Hotel Luxury",
  description: "Frequently Asked Questions at Hotel Luxury.",
};

export default async function FaqPage() {
  const hpSettings = await getHomepageSettings();
  const settings = await getFaqPageSettings();

  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col w-full">
        {settings.hero.isVisible !== false && (
          <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 w-full h-full z-0">
              <img
                src={
                  settings.hero.image ||
                  "https://images.unsplash.com/photo-1542314831-c6a4d27160c9?q=80&w=2825&auto=format&fit=crop"
                }
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />
            </div>

            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
              <h1
                className="text-white mb-6 tracking-tight leading-tight"
                style={{ fontSize: "var(--theme-heading-size)", textTransform: "uppercase" }}
              >
                {settings.hero.title}
              </h1>

              <p className="text-white/90 text-lg md:text-2xl font-light">{settings.hero.subtitle}</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full py-32 px-6 md:px-12 lg:px-24">
          {settings.faqs.isVisible !== false && settings.faqs.items && settings.faqs.items.length > 0 && (
            <FaqAccordion items={settings.faqs.items} />
          )}

          {settings.faqs.isVisible !== false && (!settings.faqs.items || settings.faqs.items.length === 0) && (
            <div className="text-center py-20 text-zinc-400">No frequently asked questions available at this time.</div>
          )}
        </div>
      </main>
    </div>
  );
}
