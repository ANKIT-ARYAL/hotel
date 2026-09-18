export interface BaseSectionSettings {
  isVisible: boolean;
  title: string;
}

export interface TypographyOverrides {
  titleSize?: string;
  subtitleSize?: string;
  bodySize?: string;
  captionSize?: string;
  nameSize?: string;
  detailsSize?: string;
  priceSize?: string;
  categorySize?: string;
  statSize?: string;
  metaSize?: string;
  categoryTitleSize?: string;
  itemNameSize?: string;
  itemDescSize?: string;
}

export interface DiningVenue {
  id: string;
  name: string;
  details: string; // e.g., "Fine Dining • Open 18:00 - 23:00"
  image: string;
}

export interface PhilosophyStat {
  id: string;
  label: string;
  value: string;
}

export interface PhilosophySection extends BaseSectionSettings {
  title: string;
  description: string;
  image?: string | null;
  videoUrl?: string | null;
  stats: PhilosophyStat[];
  typography?: TypographyOverrides;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price?: string;
  dietaryTags?: string[];
  image?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  image?: string;
  items: MenuItem[];
}

export interface MenuSection extends BaseSectionSettings {
  title: string;
  description: string;
  categories: MenuCategory[];
  typography?: TypographyOverrides;
}

export interface DiningSliderSection extends BaseSectionSettings {
  description: string;
  images: { id: string; url: string }[];
  typography?: TypographyOverrides;
}

export interface DiningPageSettings {
  hero: BaseSectionSettings & {
    subtitle?: string;
    image: string | null;
    videoUrl?: string | null;
  };
  intro: BaseSectionSettings & {
    description: string;
  };
  restaurantsList: BaseSectionSettings & {
    description: string;
    venues: DiningVenue[];
  };
  philosophy: PhilosophySection;
  menus: MenuSection;
  events: DiningSliderSection;
  bar: DiningSliderSection;
  liveMusic: DiningSliderSection;
  privateDining: DiningSliderSection;
}

export const defaultDiningPageSettings: DiningPageSettings = {
  hero: {
    isVisible: true,
    title: "CUISINE SHAPED BY TRADITION",
    image: "/uploads/1789613047675-977465389.png",
    videoUrl: null,
  },
  intro: {
    isVisible: true,
    title: "An unforgettable culinary journey.",
    description: "<p>Experience the finest traditional recipes brought to life by master chefs.</p>",
  },
  restaurantsList: {
    isVisible: true,
    title: "Our Venues",
    description: "Explore our distinctive dining venues and culinary experiences.",
    venues: [],
  },
  philosophy: {
    isVisible: true,
    title: "Our Culinary Philosophy",
    description: "<p>Rooted in tradition, driven by seasonality.</p>",
    image: null,
    videoUrl: null,
    stats: [
      { id: "1", label: "Local Ingredients", value: "80%" },
      { id: "2", label: "Kilometer Radius", value: "50km" },
      { id: "3", label: "Partner Farms", value: "12" },
    ],
    typography: {},
  },
  menus: {
    isVisible: true,
    title: "Chef's Specials",
    description: "A curated selection of our finest seasonal creations.",
    categories: [
      {
        id: "c1",
        title: "Specials",
        items: [
          {
            id: "i1",
            name: "Wagyu Beef Tenderloin",
            description: "A5 Wagyu with truffle mash, roasted asparagus, and a rich red wine reduction.",
            price: "$120",
            dietaryTags: ["gluten-free"],
            image: "/uploads/events_wine_tasting_1789633002418.jpg",
          },
          {
            id: "i2",
            name: "Pan-Seared Scallops",
            description: "Diver scallops served over a bed of sweet corn puree with crispy pancetta.",
            price: "$45",
            dietaryTags: ["gluten-free"],
            image: "/uploads/exterior.jpg",
          },
          {
            id: "i3",
            name: "Lobster Risotto",
            description: "Creamy Arborio rice with fresh Maine lobster, saffron, and aged parmesan.",
            price: "$65",
            dietaryTags: [],
            image: "/uploads/cocktail_closeup_1789632977279.jpg",
          },
          {
            id: "i4",
            name: "Dark Chocolate Soufflé",
            description: "Decadent Valrhona chocolate soufflé with vanilla bean crème anglaise.",
            price: "$25",
            dietaryTags: ["vegetarian"],
            image: "/uploads/bar_interior_1789632964846.jpg",
          },
        ],
      },
    ],
    typography: {},
  },
  events: {
    isVisible: true,
    title: "Events & Private Dining",
    description: "Memorable moments crafted for you.",
    images: [],
    typography: {},
  },
  bar: {
    isVisible: true,
    title: "The Bar & Lounge",
    description: "Signature cocktails and curated wines in an intimate setting.",
    images: [],
    typography: {},
  },
  liveMusic: {
    isVisible: true,
    title: "Live Entertainment",
    description: "Experience enchanting evenings with our curated live music performances.",
    images: [],
    typography: {},
  },
  privateDining: {
    isVisible: true,
    title: "Private Dining",
    description: "Exclusive spaces for your most important gatherings and celebrations.",
    images: [],
    typography: {},
  },
};
