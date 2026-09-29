import React from "react";
import type { Metadata } from "next";

import { Mail, MapPin, Phone } from "lucide-react";

import { getContactPageSettings } from "@/app/actions/contact-page-settings";
import { ContactForm } from "@/components/contact/ContactForm";
import { defaultContactPageSettings } from "@/components/contact/types";
import Image from "next/image";




export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getContactPageSettings();
    let seoTitle = "";
    let metaDescription = "";
    let keywords = "";
    
    // Search for SEO fields in any section of the settings
    for (const key of Object.keys(settings)) {
      const section = (settings as any)[key];
      if (section && typeof section === 'object') {
        if (section.seoTitle && !seoTitle) seoTitle = section.seoTitle;
        if (section.metaDescription && !metaDescription) metaDescription = section.metaDescription;
        if (section.keywords && !keywords) keywords = section.keywords;
      }
    }
    
    return {
      title: seoTitle || "Contact Us | The Hotel",
      description: metaDescription || "Get in touch with us for any inquiries, reservations, or special requests.",
      keywords: keywords || undefined,
    };
  } catch (error) {
    return {
      title: "Contact Us | The Hotel",
      description: "Get in touch with us for any inquiries, reservations, or special requests.",
    };
  }
}

export default async function ContactPage() {
  const settings = await getContactPageSettings();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.header.image || defaultContactPageSettings.header.image}
            alt=""
            className="w-full h-full object-cover"
           width={1920} height={1080} />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mt-20">
          <h1 className="!text-white mb-6 text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]">
            {settings.header.title}
          </h1>
          <p className="!text-white/80 font-oklean text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)] max-w-2xl mx-auto font-light text-center">
            {settings.header.subtitle}
          </p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24">
          {/* Contact Details (Left side) */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-argine text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]text-zinc-900 mb-6">{settings.contactInfo.title}</h2>
              <p className="text-zinc-600 font-oklean leading-relaxed whitespace-pre-line text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]">
                {settings.contactInfo.description}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-zinc-200/50 flex items-center justify-center shrink-0 mr-6">
                  <MapPin className="w-5 h-5 text-zinc-900" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900 mb-2 font-[var(--theme-heading-font)]">{settings.location.title}</h4>
                  <p className="text-zinc-600 font-oklean whitespace-pre-line font-[var(--theme-body-font)]">{settings.location.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-zinc-200/50 flex items-center justify-center shrink-0 mr-6">
                  <Phone className="w-5 h-5 text-zinc-900" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900 mb-2 font-[var(--theme-heading-font)]">{settings.phone.title}</h4>
                  <p className="text-zinc-600 font-oklean font-[var(--theme-body-font)]">{settings.phone.number}</p>
                  <p className="text-sm text-zinc-500 mt-1 font-[var(--theme-body-font)]">{settings.phone.availability}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-zinc-200/50 flex items-center justify-center shrink-0 mr-6">
                  <Mail className="w-5 h-5 text-zinc-900" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900 mb-2 font-[var(--theme-heading-font)]">{settings.email.title}</h4>
                  <p className="text-zinc-600 font-oklean font-[var(--theme-body-font)]">{settings.email.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right side) */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </main>

      {/* Map Section */}
      {settings.location?.address && (
        <div className="w-full h-[500px] mt-10">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.location.address.replace(/\n/g, " "))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale-[20%] opacity-90"
          />
        </div>
      )}
    </div>
  );
}
