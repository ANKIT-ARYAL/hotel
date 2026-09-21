import React from "react";

import type { Metadata } from "next";

import { getHomepageSettings } from "@/app/actions/homepage-settings";

export const metadata: Metadata = {
  title: "Privacy Policy | Hotel Luxury",
  description: "Privacy Policy for Hotel Luxury.",
};

export default async function PrivacyPage() {
  const hpSettings = await getHomepageSettings();

  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col w-full py-32 px-6 md:px-12 lg:px-24">
        <div className="w-full">
          <h1
            className="text-zinc-900 mb-12 tracking-tight uppercase text-5xl md:text-[length:var(--theme-heading-size)] font-[var(--theme-heading-font)]"
          >
            Privacy Policy
          </h1>

          <div
            className="max-w-none font-light text-justify trackjng-tighter text-zinc-600 text-lg md:text-[length:var(--theme-body-size)] font-[var(--theme-body-font)]"            
          >
            <p>
              <strong>Effective Date: September 18, 2026</strong>
            </p>

            <p>
              At Hotel Luxury, we are committed to protecting the privacy and security of our guests personal
              information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you
              visit our website, make a reservation, or stay at our property.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as your name, contact details, payment
              information, and specific preferences when you make a reservation or sign up for our newsletter.
              Additionally, we may automatically collect certain technical information when you interact with our
              website, including your IP address, browser type, and browsing behavior.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">2. Use of Your Information</h2>
            <p>
              We utilize your personal information to facilitate your reservations, process payments, and provide
              personalized services during your stay. We may also use your data to communicate important updates, send
              promotional offers (if you have opted in), and improve our website and overall guest experience.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data to third parties. We may share your information with trusted service
              providers who assist us in operating our business, such as payment processors and IT support teams. These
              partners are strictly bound by confidentiality agreements. We may also disclose your information if
              required by law or to protect our rights and the safety of our guests.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">4. Security Measures</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures to protect your
              personal information from unauthorized access, alteration, disclosure, or destruction. While we strive to
              ensure the utmost security, no transmission over the internet is entirely secure, and we cannot guarantee
              absolute data security.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">5. Your Rights and Choices</h2>
            <p>
              You have the right to access, correct, or request the deletion of your personal information held by us.
              You may also opt out of receiving promotional communications at any time by following the unsubscribe
              instructions included in those emails.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact
              our Data Protection Officer at privacy@hotel.com or write to us at our main administrative office.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
