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

export interface DiningEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string | null;
  type: 'live-music' | 'wine-dinner' | 'private-dining' | 'tasting' | 'other';
  capacity?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface EventsSection extends BaseSectionSettings {
  title: string;
  description: string;
  events: DiningEvent[];
  typography?: TypographyOverrides;
}

export interface Cocktail {
  id: string;
  name: string;
  description: string;
  price?: string;
  image?: string | null;
}

export interface BarSection extends BaseSectionSettings {
  title: string;
  description: string;
  image?: string | null;
  videoUrl?: string | null;
  happyHour?: string;
  cocktails: Cocktail[];
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
  events: EventsSection;
  bar: BarSection;
}

export const defaultDiningPageSettings: DiningPageSettings = {
  hero: {
    isVisible: true,
    title: 'CUISINE SHAPED BY TRADITION',
    image: '/uploads/1789613047675-977465389.png',
    videoUrl: null,
  },
  intro: {
    isVisible: true,
    title: 'An unforgettable culinary journey.',
    description: '<p>Experience the finest traditional recipes brought to life by master chefs.</p>',
  },
  restaurantsList: {
    isVisible: true,
    title: 'Our Venues',
    description: 'Explore our distinctive dining venues and culinary experiences.',
    venues: []
  },
  philosophy: {
    isVisible: true,
    title: 'Our Culinary Philosophy',
    description: '<p>Rooted in tradition, driven by seasonality.</p>',
    image: null,
    videoUrl: null,
    stats: [
      { id: '1', label: 'Local Ingredients', value: '80%' },
      { id: '2', label: 'Kilometer Radius', value: '50km' },
      { id: '3', label: 'Partner Farms', value: '12' },
    ],
    typography: {},
  },
  menus: {
    isVisible: true,
    title: 'Our Menus',
    description: 'Explore our seasonal offerings across all venues.',
    categories: [],
    typography: {},
  },
  events: {
    isVisible: true,
    title: 'Events & Private Dining',
    description: 'Memorable moments crafted for you.',
    events: [],
    typography: {},
  },
  bar: {
    isVisible: true,
    title: 'The Bar & Lounge',
    description: 'Signature cocktails and curated wines in an intimate setting.',
    image: null,
    videoUrl: null,
    happyHour: 'Daily 16:00–19:00',
    cocktails: [],
    typography: {},
  }
};