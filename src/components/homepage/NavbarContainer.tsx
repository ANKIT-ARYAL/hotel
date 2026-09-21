import React from "react";

import { getNavbarSettings } from "@/app/actions/navbar-settings";
import { auth } from "@/lib/auth";

import { Navbar } from "./Navbar";

export async function NavbarContainer() {
  const settings = await getNavbarSettings();
  const session = await auth();

  return <Navbar settings={settings} isLoggedIn={Boolean(session?.user)} />;
}
