"use client";

import { useEffect } from "react";

export default function LoginPopupCompletePage() {
  useEffect(() => {
    window.opener?.postMessage({ type: "hotel-google-login-complete" }, window.location.origin);
    window.close();
  }, []);

  return <main className="flex min-h-screen items-center justify-center p-6">Completing sign in…</main>;
}
