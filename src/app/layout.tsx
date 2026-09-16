import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Syne, Outfit, Playfair_Display, Cinzel, Prata, Lora, Inter } from "next/font/google";
import "./globals.css";
import { getHomepageSettings } from '@/app/actions/homepage-settings';
import { FooterSection } from "@/components/homepage/FooterSection";
import { Navbar } from "@/components/homepage/Navbar";
import { Toaster } from 'sonner';

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-argine",
  subsets: ["latin"],
});

const syne = Syne({
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-nove",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-oklean",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const prata = Prata({
  weight: ['400'],
  variable: "--font-prata",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Luxury",
  description: "Experience Unmatched Luxury",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getHomepageSettings();
  const headersList = await headers();
  const isAdmin = headersList.get('x-is-admin') === 'true';
  
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${syne.variable} ${outfit.variable} ${playfair.variable} ${cinzel.variable} ${prata.variable} ${lora.variable} ${inter.variable} h-full antialiased`}
    >
      <body 
        className={`min-h-full flex flex-col ${settings.theme.fontFamily}`}
        style={{ '--theme-heading-font': `var(--${settings.theme.headingFontFamily})` } as React.CSSProperties}
      >
        {!isAdmin && <Navbar />}
        {children}
        {!isAdmin && settings.footer.isVisible && <FooterSection settings={settings.footer} />}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
