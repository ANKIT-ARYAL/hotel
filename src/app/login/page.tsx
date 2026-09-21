import { redirect } from "next/navigation";
import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { GuestLoginForm } from "./GuestLoginForm";
import { auth } from "@/lib/auth";

export default async function GuestLoginPage() {
  if ((await auth())?.user) redirect("/account");
  const homepage = await getHomepageSettings();
  const heroImage = homepage.hero.image || homepage.hero.backgroundImageFallback;
  return (
    <main className="relative flex min-h-[calc(100vh-1px)] items-center justify-center overflow-hidden px-6 py-32 md:px-12 lg:px-24">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 w-full max-w-7xl"><GuestLoginForm /></div>
    </main>
  );
}
