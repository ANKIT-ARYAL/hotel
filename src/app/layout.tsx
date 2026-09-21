/**
 * FlyUp eCommerce CMS
 * Developed & Maintained by FlyUp Technology Pvt. Ltd.
 * Website: https://flyuptechnology.com
 * @author FlyUp Technology Pvt. Ltd.
 */

import { headers } from "next/headers";

import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";

import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { FooterSection } from "@/components/homepage/FooterSection";
import { NavbarContainer } from "@/components/homepage/NavbarContainer";

const fontStacks: Record<string, string> = {
  "font-argine": 'Georgia, "Times New Roman", serif',
  "font-playfair": 'Georgia, "Times New Roman", serif',
  "font-cinzel": 'Georgia, "Times New Roman", serif',
  "font-prata": 'Georgia, "Times New Roman", serif',
  "font-lora": 'Georgia, "Times New Roman", serif',
  "font-nove": '"Avenir Next", Futura, "Trebuchet MS", Arial, sans-serif',
  "font-oklean": '"Avenir Next", "Helvetica Neue", Arial, sans-serif',
  "font-sans": '"Helvetica Neue", Arial, sans-serif',
};

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

  const headingFont = fontStacks[settings.theme.headingFontFamily] || fontStacks["font-argine"];
  const bodyFont = fontStacks[settings.theme.fontFamily] || fontStacks["font-sans"];
  const logoFont = fontStacks[settings.theme.logoFontFamily || "font-nove"] || fontStacks["font-nove"];

  return (
    <html
      lang="en"
      className="h-full antialiased bg-white"
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
