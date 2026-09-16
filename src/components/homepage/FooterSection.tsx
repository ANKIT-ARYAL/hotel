import React from 'react';
import { HomepageSettings } from './types';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FooterSectionProps {
  settings: HomepageSettings['footer'];
}

export function FooterSection({ settings }: FooterSectionProps) {
  return (
    <footer className=" py-16 px-6 border-t border-zinc-900">
      <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand & Socials */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-zinc-950 tracking-tight">HOTEL LUXURY</h3>
          <p className="text-zinc-500 text-sm">
            Experience the pinnacle of hospitality. Where every stay is a story worth telling.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full text-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full text-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full text-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 text-zinc-950 ">Explore</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-zinc-500 hover:text-white transition-colors">Rooms & Suites</Link></li>
            <li><Link href="#" className="text-zinc-500 hover:text-white transition-colors">Dining</Link></li>
            <li><Link href="#" className="text-zinc-500 hover:text-white transition-colors">Spa & Wellness</Link></li>
            <li><Link href="#" className="text-zinc-500 hover:text-white transition-colors">Offers</Link></li>
            <li><Link href="#" className="text-zinc-500 hover:text-white transition-colors">Gallery</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 text-zinc-950 ">Contact</h4>
          <ul className="space-y-4">
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
          <h4 className="text-lg font-semibold text-white mb-6 text-zinc-950 ">Newsletter</h4>
          <p className="text-zinc-500 text-sm mb-4">
            Subscribe to receive special offers and updates.
          </p>
          <div className="flex space-x-2">
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

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 text-center flex flex-col md:flex-row items-center justify-between">
        <p className="text-zinc-600 text-sm">{settings.copyright}</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#" className="text-zinc-600 text-sm hover:text-zinc-400">Privacy Policy</Link>
          <Link href="#" className="text-zinc-600 text-sm hover:text-zinc-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
