/**
 * FlyUp eCommerce CMS
 * Developed & Maintained by FlyUp Technology Pvt. Ltd.
 * Website: https://flyuptechnology.com
 * @author FlyUp Technology Pvt. Ltd.
 */

import { headers } from "next/headers";
import {
  Cinzel,
  Cormorant_Garamond,
  Inter,
  Lora,
  Montserrat,
  Outfit,
  Playfair_Display,
  Prata,
  Roboto,
  Syne,
} from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";

import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { FooterSection } from "@/components/homepage/FooterSection";
import { NavbarContainer } from "@/components/homepage/NavbarContainer";

const cormorant = Cormorant_Garamond({ weight: ["300", "400", "500", "600", "700"], variable: "--font-argine", subsets: ["latin"] });
const syne = Syne({ weight: ["400", "500", "600", "700", "800"], variable: "--font-nove", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-oklean", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const prata = Prata({ weight: ["400"], variable: "--font-prata", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const roboto = Roboto({ weight: ["300", "400", "500", "700"], variable: "--font-roboto", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHomepageSettings();
  return {
    title: settings.hero?.title || "FlyUp CMS",
    description: settings.hero?.subtitle || "Developed by FlyUp Technology",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getHomepageSettings();
  const headersList = await headers();
  const isAdmin = headersList.get("x-is-admin") === "true";

  // Preserve the original public brand pairing. The admin setting still controls
  // other typography choices, but these are the original header/logo defaults.
  const headingFont = "var(--font-argine)";
  const bodyFont = `var(--${settings.theme.fontFamily || "font-sans"})`;
  const logoFont = `var(--${settings.theme.logoFontFamily || "font-nove"})`;

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${syne.variable} ${outfit.variable} ${playfair.variable} ${cinzel.variable} ${prata.variable} ${lora.variable} ${inter.variable} ${roboto.variable} ${montserrat.variable} h-full antialiased bg-white`}
    >
      <body
        className={`min-h-full flex flex-col ${settings.theme.fontFamily} max-w-[1920px] mx-auto w-full relative shadow-2xl overflow-x-hidden`}
        style={{
  "--theme-heading-font": headingFont,
  "--theme-heading-size": settings.theme.headingFontSize || "1em",
  "--admin-heading-size": settings.theme.adminHeadingFontSize || "1.875rem",
  "--theme-body-size": settings.theme.bodyFontSize || "16px",
  "--theme-body-font": bodyFont,
  "--theme-logo-font": logoFont,
} as React.CSSProperties}

      >
        {!isAdmin && <NavbarContainer />}
        {children}
        {!isAdmin && settings.footer.isVisible && (
          <FooterSection settings={settings.footer} />
        )}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
