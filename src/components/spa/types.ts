export interface SpaPageSettings {
  hero: {
    isVisible: boolean;
    title: string;
    subtitle: string;
    image: string;
    typography?: {
      titleSize?: string;
      subtitleSize?: string;
    };
  };
  intro: {
    isVisible: boolean;
    title: string;
    description: string;
    typography?: {
      titleSize?: string;
      bodySize?: string;
    };
  };
  treatments: {
    isVisible: boolean;
    title: string;
    description: string;
    categories: SpaTreatmentCategory[];
    typography?: {
      titleSize?: string;
      bodySize?: string;
    };
  };
  facilities: {
    isVisible: boolean;
    title: string;
    description: string;
    items: SpaFacility[];
    typography?: {
      titleSize?: string;
      bodySize?: string;
    };
  };
}

export interface SpaTreatmentCategory {
  id: string;
  name: string;
  treatments: SpaTreatment[];
}

export interface SpaTreatment {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
}

export interface SpaFacility {
  id: string;
  name: string;
  description: string;
  images: string[];
}

export const defaultSpaPageSettings: SpaPageSettings = {
  hero: {
    isVisible: true,
    title: "The Sanctuary Spa",
    subtitle: "A holistic retreat for mind, body, and soul.",
    image: "/uploads/unsplash-1540555700478-4be289fbecef.jpg",
    typography: {},
  },
  intro: {
    isVisible: true,
    title: "Discover Pure Tranquility",
    description:
      "Immerse yourself in an oasis of serenity where time stands still. Our award-winning sanctuary combines ancient wellness philosophies with modern therapeutic techniques to deliver a truly transformative experience. Spread across 10,000 square feet of architecturally stunning spaces, The Sanctuary Spa is designed to guide you through a journey of physical rejuvenation and spiritual awakening. Disconnect from the noise of the outside world, surrender to the expert hands of our master therapists, and reconnect with your inner self in an environment of unparalleled luxury.",
    typography: {},
  },
  treatments: {
    isVisible: true,
    title: "Signature Treatments",
    description: "Carefully curated therapies designed to rejuvenate and restore.",
    categories: [
      {
        id: "cat-1",
        name: "Massages",
        treatments: [
          {
            id: "t-1",
            name: "Deep Tissue Harmony",
            duration: "90 mins",
            price: "$180",
            description:
              "A therapeutic massage focusing on the deeper layers of muscle tissue to release chronic tension, using slow strokes and deep finger pressure on contracted areas.",
          },
          {
            id: "t-2",
            name: "Aromatherapy Bliss",
            duration: "60 mins",
            price: "$140",
            description:
              "A gentle, soothing massage that incorporates customized essential oil blends to promote emotional and physical healing.",
          },
        ],
      },
      {
        id: "cat-2",
        name: "Facials",
        treatments: [
          {
            id: "t-3",
            name: "Radiance Renewal",
            duration: "60 mins",
            price: "$150",
            description:
              "A revitalizing facial that restores a youthful glow, featuring a bespoke blend of active botanical ingredients and a lifting massage technique.",
          },
        ],
      },
    ],
    typography: {},
  },
  facilities: {
    isVisible: true,
    title: "Wellness Facilities",
    description: "Enhance your spa journey with our extensive thermal and relaxation facilities.",
    items: [
      {
        id: "f-1",
        name: "Thermal Suites & Hydrotherapy",
        description:
          "Experience the profound benefits of contrast therapy within our expansive thermal suites. Begin your journey in the Himalayan salt saunas, where deeply penetrating heat soothes muscular tension and detoxifies the body. Transition to the aromatic herbal steam rooms to clear the respiratory system, before invigorating your senses with the Nordic ice fountains and experiential rainfall showers. Our hydrotherapy circuit is meticulously designed to stimulate circulation, boost the immune system, and leave you feeling completely revitalized.",
        images: [
          "/uploads/unsplash-1584622650111-993a426fbf0a.jpg",
          "/uploads/unsplash-1571257121735-a7db2e38148f.jpg",
          "/uploads/unsplash-1540555700478-4be289fbecef.jpg",
        ],
      },
      {
        id: "f-2",
        name: "The Tranquility Pool",
        description:
          "At the heart of The Sanctuary lies our breathtaking heated indoor infinity pool. Set within a serene, candle-lit cavern featuring minimalist stone architecture and dark slate finishes, the pool offers a mesmerizing environment for deep relaxation. Submerge yourself in the mineral-rich waters, enjoy the targeted massage jets, or simply recline on the submerged thermal loungers as ambient underwater acoustics melt away your stress.",
        images: [
          "/uploads/unsplash-1571257121735-a7db2e38148f.jpg",
          "/uploads/unsplash-1584622650111-993a426fbf0a.jpg",
        ],
      },
    ],
    typography: {},
  },
};
