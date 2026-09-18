export interface BaseSectionSettings {
  isVisible: boolean;
  title: string;
}

export interface RoomsPageSettings {
  hero: BaseSectionSettings & {
    subtitle: string;
    image: string | null;
    videoUrl?: string | null;
  };
  listSection: BaseSectionSettings & {
    description: string;
  };
  detailsHero: BaseSectionSettings & {
    videoUrl?: string | null;
    image?: string | null;
  };
  amenitiesSection: BaseSectionSettings & {
    subtitle: string;
  };
  bookingCta: BaseSectionSettings & {
    description: string;
    image: string | null;
    buttonLabel: string;
  };
}

export const defaultRoomsPageSettings: RoomsPageSettings = {
  hero: {
    isVisible: true,
    title: "ROOMS & SUITES",
    subtitle: "Experience unparalleled luxury and heritage.",
    image: null,
    videoUrl: "/uploads/1789275742970-291594583.mp4",
  },
  listSection: {
    isVisible: true,
    title: "Our Accommodations",
    description: "Explore our curated selection of fine rooms.",
  },
  detailsHero: {
    isVisible: true,
    title: "", // usually overridden by dynamic room title
    videoUrl: "/uploads/1789301378477-596276179.mp4",
    image: null,
  },
  amenitiesSection: {
    isVisible: true,
    title: "ROOM AMENITIES",
    subtitle: "Designed for your comfort",
  },
  bookingCta: {
    isVisible: true,
    title: "Ready to Experience luxury?",
    description: "Book your stay today and discover the unparalleled luxury of our hotel.",
    image: null,
    buttonLabel: "Book Now",
  },
};
