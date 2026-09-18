export interface NavLink {
  id: string;
  label: string;
  href: string;
  isVisible: boolean;
  children?: Omit<NavLink, "children">[];
}

export interface NavbarSettings {
  links: NavLink[];
  ctaButton: {
    isVisible: boolean;
    label: string;
    href: string;
  };
}

export const defaultNavbarSettings: NavbarSettings = {
  links: [
    { id: "1", label: "Rooms & Suites", href: "/rooms-and-suites", isVisible: true },
    { id: "2", label: "Dining", href: "/dining", isVisible: true },
    { id: "3", label: "Spa", href: "/spa", isVisible: true },
    { id: "4", label: "Experiences", href: "/experiences", isVisible: true },
    { id: "5", label: "Gallery", href: "/gallery", isVisible: true },
  ],
  ctaButton: {
    isVisible: true,
    label: "Book Now",
    href: "/booking",
  },
};
