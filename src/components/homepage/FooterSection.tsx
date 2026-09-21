import React from "react";

import Link from "next/link";

import { Link as LinkIcon, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { HomepageSettings } from "./types";

interface FooterSectionProps {
  settings: HomepageSettings["footer"];
}

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "twitter":
    case "x":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "youtube":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      );
    default:
      return <LinkIcon className="w-5 h-5 text-zinc-400" />;
  }
};

export function FooterSection({ settings }: FooterSectionProps) {
  return (
    <footer className="relative py-16 pb-28 border-t border-zinc-900">
      <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
        {/* Brand & Socials */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-zinc-950 tracking-tight font-[var(--theme-heading-font)]">HOTEL LUXURY</h3>
          <p className="text-zinc-500 text-sm font-[var(--theme-body-font)]">
            {settings.brandDescription ||
              "Experience the pinnacle of hospitality. Where every stay is a story worth telling."}
          </p>
          <div className="flex space-x-4">
            {(settings.socialLinks || [])
              .filter((link) => link.isVisible)
              .map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  className="w-10 h-10 rounded-full text-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                >
                  {getSocialIcon(link.platform)}
                </Link>
              ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 text-zinc-950  font-[var(--theme-heading-font)]">Explore</h4>
          <ul className="space-y-3 font-[var(--theme-body-font)]">
            {(settings.exploreLinks || [])
              .filter((link) => link.isVisible)
              .map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-zinc-500 hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 text-zinc-950 font-[var(-  -theme-heading-font)]">Quick Links</h4>
          <ul className="space-y-3 font-[var(--theme-body-font)]">
            {(settings.quickLinks || [])
              .filter((link) => link.isVisible)
              .map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-zinc-500 hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 text-zinc-950 font-[var  (--theme-heading-font)] ">Contact</h4>
          <ul className="space-y-4 font-[var(--theme-body-font)]">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-zinc-500 shrink-0 mt-0.5" />
              <span className="text-zinc-500 text-sm">{settings.address}</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-zinc-500 shrink-0" />
              <span className="text-zinc-500 text-sm">{settings.phone}</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-zinc-500 shrink-0" />
              <span className="text-zinc-500 text-sm">{settings.email}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 text-zinc-950  font-[var(--theme-he  ading-font)]">Newsletter</h4>
          <p className="text-zinc-500 text-sm mb-4 font-[var(--theme-body-font)]">Subscribe to receive special offers and updates.</p>
          <div className="flex space-x-2 font-[var(--theme-body-font)]">
            <Input
              type="email"
              placeholder="Your email"
              className=" p-3 border-zinc-500 text-white text-zinc-950 bg-white focus-visible:ring-zinc-600"
            />
            <Button variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute right-6 md:right-12 lg:right-24 bottom-6">
        <p className="text-zinc-400 text-xs sm:text-sm">{settings.copyright}</p>
      </div>
    </footer>
  );
}
