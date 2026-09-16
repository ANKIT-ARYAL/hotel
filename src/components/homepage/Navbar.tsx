'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="px-6 md:px-12 lg:px-24 flex items-center justify-between">
        <Link href="/" className={`font-nove text-3xl font-bold transition-colors ${
          isScrolled ? 'text-zinc-900' : 'text-white'
        }`}>
          HOTEL LUXURY
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Rooms & Suites', 'Dining', 'Spa', 'Experiences', 'Gallery'].map((item) => (
            <Link 
              key={item} 
              href='/rooms-and-suites' 
              className={`text-lg font-medium tracking-wide hover:opacity-70 transition-opacity ${
                isScrolled ? 'text-zinc-600' : 'text-white/90'
              }`}
            >
              {item}
            </Link>
          ))}
          <button className={`px-6 py-2.5 rounded-sm font-medium text-sm transition-colors ${
            isScrolled 
              ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
              : 'bg-white text-zinc-900 hover:bg-zinc-100'
          }`}>
            Book Now
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled ? 'text-zinc-900' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-zinc-900' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-xl border-t border-gray-100 py-4 px-6 flex flex-col space-y-4">
          {['Rooms & Suites', 'Dining', 'Spa', 'Experiences', 'Gallery'].map((item) => (
            <Link 
              key={item} 
              href='/rooms-and-suites'
              className="text-zinc-900 font-medium py-2 border-b border-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <button className="w-full mt-4 bg-zinc-900 text-white py-3 rounded-sm font-medium">
            Book Now
          </button>
        </div>
      )}
    </motion.header>
  );
}
