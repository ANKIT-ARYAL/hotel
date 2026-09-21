"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function GuestLoginForm() {
  const router = useRouter();
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === "hotel-google-login-complete") router.push("/account");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  async function openGoogleLogin() {
    const result = await signIn("google", { redirect: false, callbackUrl: `${window.location.origin}/login/popup-complete` });
    if (result?.url) {
      const popup = window.open(result.url, "hotel-google-login", "popup,width=520,height=680");
      if (!popup) window.location.assign(result.url);
    }
  }

  return <div className="w-full max-w-lg rounded-sm border border-white/30 bg-[#fffdfa]/95 p-8 shadow-2xl backdrop-blur-sm md:p-12"><p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Guest portal</p><h1 className="mt-4 text-4xl font-medium tracking-tight text-zinc-900 md:text-5xl">Welcome back</h1><p className="mt-4 text-lg leading-relaxed text-zinc-600">Sign in to manage your bookings and request hotel services.</p><Button className="mt-8 h-12 w-full rounded-sm bg-zinc-900 text-base hover:bg-zinc-800" onClick={openGoogleLogin}>Continue with Google</Button></div>;
}
