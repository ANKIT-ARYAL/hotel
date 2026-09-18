import React from "react";

import { getNavbarSettings } from "@/app/actions/navbar-settings";

import { Navbar } from "./Navbar";

export async function NavbarContainer() {
  const settings = await getNavbarSettings();

  return <Navbar settings={settings} />;
}
