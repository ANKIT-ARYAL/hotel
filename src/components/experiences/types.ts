export interface ExperiencesPageSettings {
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
  featured: {
    isVisible: boolean;
    title: string;
    description: string;
    items: ExperienceItem[];
    typography?: {
      titleSize?: string;
      bodySize?: string;
    };
  };
  localGuide: {
    isVisible: boolean;
    title: string;
    description: string;
    items: LocalGuideItem[];
    typography?: {
      titleSize?: string;
      bodySize?: string;
    };
  };
}

export interface ExperienceItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  image: string;
}

export interface LocalGuideItem {
  id: string;
  name: string;
  distance: string;
  description: string;
  image: string;
}

export const defaultExperiencesPageSettings: ExperiencesPageSettings = {
  hero: {
    isVisible: true,
    title: "Curated Experiences",
    subtitle: "Unforgettable moments tailored exclusively for our guests.",
    image: "/uploads/unsplash-1533692328991-08159ff19fca.jpg",
    typography: {},
  },
  intro: {
    isVisible: true,
    title: "A Journey Beyond The Ordinary",
    description:
      "Venture beyond the luxurious confines of the resort and discover a world of breathtaking natural beauty and rich cultural heritage. Our curated collection of experiences is designed to connect you deeply with the spirit of the destination. From traversing ancient trails with expert local guides to witnessing spectacular sunsets from the deck of a private yacht, every moment is crafted to leave you with memories that will last a lifetime. Whether you seek adrenaline-fueled adventures or peaceful cultural immersions, our dedicated concierge team will tailor the perfect itinerary to match your desires.",
    typography: {},
  },
  featured: {
    isVisible: true,
    title: "Signature Adventures",
    description: "Our most sought-after experiences, designed to create lasting memories.",
    items: [
      {
        id: "e-1",
        name: "Sunset Yacht Cruise",
        description:
          "Set sail on the azure waters aboard our exclusive 60-foot luxury catamaran. As the sun begins its descent, casting a golden hue over the horizon, you will be treated to a selection of premium champagne and gourmet canapés prepared by our executive chef. This three-hour voyage offers unparalleled views of the rugged coastline, hidden coves, and marine life. Perfect for romantic evenings or intimate celebrations with close friends.",
        image: "/uploads/unsplash-1569263979104-865ab7cd8d13.jpg",
        duration: "3 Hours",
      },
      {
        id: "e-2",
        name: "Mountain Peak Trek",
        description:
          "Embark on an exhilarating guided trek to the region's highest peak. Accompanied by our seasoned mountaineering experts, you will navigate through lush ancient forests, cross pristine alpine streams, and ascend dramatic rocky ridges. Upon reaching the summit at 2,500 meters, a breathtaking 360-degree panorama awaits. The experience concludes with a gourmet picnic lunch served at the peak, featuring locally sourced delicacies and hot artisanal beverages.",
        image: "/uploads/unsplash-1518182170546-076616fd67fe.jpg",
        duration: "Half Day",
      },
      {
        id: "e-3",
        name: "Culinary Masterclass",
        description:
          "Join our Michelin-starred executive chef for an immersive, hands-on cooking masterclass using fresh, locally sourced ingredients.",
        duration: "3 Hours",
        image: "/uploads/unsplash-1556910103-1c02745aae4d.jpg",
      },
    ],
    typography: {},
  },
  localGuide: {
    isVisible: true,
    title: "The Local Guide",
    description: "Explore the best attractions, boutiques, and hidden gems within walking distance of the hotel.",
    items: [
      {
        id: "l-1",
        name: "Historic Old Town",
        description:
          "Step back in time as you wander through the labyrinthine cobblestone streets of the Historic Old Town, a UNESCO World Heritage site located just a short distance from the resort. Marvel at the well-preserved medieval architecture, centuries-old cathedrals, and bustling market squares. Our guided walking tour includes exclusive access to hidden courtyards, artisan workshops, and a private tasting session at a historic wine cellar that has been operating since the 15th century.",
        image: "/uploads/unsplash-1556910103-1c02745aae4d.jpg",
        distance: "15 mins away",
      },
      {
        id: "l-2",
        name: "Botanical Gardens",
        description:
          "Spanning over 50 acres of meticulously landscaped terrain, the Royal Botanical Gardens are a sanctuary of vibrant colors and exotic fragrances. Discover rare orchids, ancient bonsai trees, and tranquil koi ponds. Perfect for a leisurely afternoon stroll or a morning meditation session among the lotus blooms.",
        image: "/uploads/unsplash-1513622470522-26c3c8a854bc.jpg",
        distance: "20 mins away",
      },
      {
        id: "lg-3",
        name: "Botanical Gardens",
        distance: "5 min walk",
        description:
          "Stroll through lush, exotic flora and tranquil water features in the citys premier botanical sanctuary.",
        image: "/uploads/unsplash-1585320806297-9794b3e4ce11.jpg",
      },
    ],
    typography: {},
  },
};
