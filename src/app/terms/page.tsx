import React from "react";

import type { Metadata } from "next";

import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { Loader } from "@/components/homepage/Loader";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hotel Luxury",
  description: "Terms and Conditions for Hotel Luxury.",
};

export default async function TermsPage() {
  const hpSettings = await getHomepageSettings();

  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col w-full py-32 px-6 md:px-12 lg:px-24">
        <div className="w-full">
          <h1
            className="text-zinc-900 mb-12 tracking-tight uppercase"
            style={{ fontSize: "var(--theme-heading-size)" }}
          >
            Terms & Conditions
          </h1>

          <div
            className="prose prose-zinc prose-lg max-w-none font-light leading-relaxed text-zinc-600"
            style={{ fontSize: "var(--theme-body-size)" }}
          >
            <p>
              <strong>Effective Date: September 18, 2026</strong>
            </p>

            <p>
              Welcome to Hotel Luxury. These Terms and Conditions govern your use of our website and the services
              provided by our esteemed hotel. By accessing our website, making a reservation, or utilizing our
              amenities, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">1. Reservations and Payment</h2>
            <p>
              All reservations are subject to availability and confirmation. A valid credit card or advance payment is
              required to guarantee your reservation. We reserve the right to pre-authorize credit cards prior to
              arrival. Full payment for your stay, including anticipated incidental charges, may be required upon
              check-in.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">2. Cancellation Policy</h2>
            <p>
              Cancellations must be made at least 48 hours prior to the scheduled date of arrival to avoid a
              cancellation fee equivalent to one nights room rate and applicable taxes. Certain promotional rates or
              premium suites may have non-refundable policies, which will be explicitly stated at the time of booking.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">3. Check-In and Check-Out</h2>
            <p>
              Standard check-in time is 3:00 PM, and check-out time is 12:00 PM. Early check-in and late check-out
              requests are subject to availability and may incur additional charges. Valid government-issued photo
              identification is required upon arrival.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">4. Guest Code of Conduct</h2>
            <p>
              To ensure a serene and luxurious environment for all our patrons, we expect our guests to conduct
              themselves with decorum. Any behavior that disrupts the tranquility of the hotel or endangers the safety
              of staff and other guests may result in immediate eviction without refund.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">5. Liability</h2>
            <p>
              Hotel Luxury is not liable for any loss, damage, or theft of personal property. In-room safes are provided
              for your convenience, and we strongly advise utilizing them for valuables. Our total liability for any
              claims arising from your stay shall not exceed the total amount paid for the reservation.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 mt-12 mb-4">6. Modification of Terms</h2>
            <p>
              We reserve the right to amend these Terms and Conditions at our discretion. Any changes will be posted on
              this page with an updated effective date. Continued use of our services constitutes acceptance of the
              revised Terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
