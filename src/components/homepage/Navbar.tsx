"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

import type { NavbarSettings } from "./NavbarManagerTypes";

interface NavbarProps {
  settings: NavbarSettings;
}

export function Navbar({ settings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const forceScrolled = pathname === "/terms" || pathname === "/privacy";
  const effectiveScrolled = isScrolled || forceScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleLinks = settings.links.filter((link) => link.isVisible);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        effectiveScrolled || isMobileMenuOpen
          ? "bg-background/95 backdrop-blur-md shadow-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="px-6 md:px-12 lg:px-24 flex items-center justify-between">
        <Link
          href="/"
          className={`font-nove text-xl md:text-3xl font-bold transition-colors ${
            effectiveScrolled || isMobileMenuOpen ? "text-zinc-900" : "text-white"
          }`}
        >
          HOTEL LUXURY
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {visibleLinks.map((item) => (
            <div
              key={item.id}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center font-medium tracking-wide transition-opacity ${
                  effectiveScrolled ? "text-zinc-600 hover:text-zinc-900" : "text-white/90 hover:text-white"
                }`}
                style={{ fontSize: "var(--theme-body-size)" }}
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <ChevronDown className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {/* Desktop Dropdown */}
              {item.children && item.children.length > 0 && (
                <AnimatePresence>
                  {activeDropdown === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-4 w-48 bg-white border border-zinc-100 shadow-xl rounded-sm overflow-hidden py-2"
                    >
                      {item.children
                        .filter((c) => c.isVisible)
                        .map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}

          {settings.ctaButton.isVisible && (
            <Link
              href={settings.ctaButton.href}
              className={`px-6 py-2.5 rounded-sm font-medium text-sm transition-colors ${
                effectiveScrolled
                  ? "bg-zinc-900 text-white hover:bg-zinc-800"
                  : "bg-white text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              {settings.ctaButton.label}
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${effectiveScrolled || isMobileMenuOpen ? "text-zinc-900" : "text-white"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${effectiveScrolled ? "text-zinc-900" : "text-white"}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-background shadow-xl border-t border-gray-100"
          >
            <div className="py-4 px-6 flex flex-col space-y-2">
              {visibleLinks.map((item) => (
                <div key={item.id} className="border-b border-gray-50 pb-2">
                  <div className="flex justify-between items-center py-2">
                    <Link
                      href={item.href}
                      className="text-zinc-900 font-medium text-lg"
                      onClick={() => !item.children?.length && setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <button onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${activeDropdown === item.id ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === item.id && item.children && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 flex flex-col space-y-3">
                          {item.children
                            .filter((c) => c.isVisible)
                            .map((child) => (
                              <Link
                                key={child.id}
                                href={child.href}
                                className="text-zinc-500 font-medium py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {settings.ctaButton.isVisible && (
                <Link
                  href={settings.ctaButton.href}
                  className="w-full mt-4 bg-zinc-900 text-white py-3 rounded-sm font-medium text-center block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {settings.ctaButton.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
