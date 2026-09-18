export interface GalleryPageSettings {
  hero: {
    isVisible: boolean;
    title: string;
    description: string;
    image?: string;
    typography?: {
      titleSize?: string;
      descriptionSize?: string;
    };
  };
  categories: {
    id: string;
    name: string;
  }[];
  images: {
    id: string;
    url: string;
    title: string;
    categoryId: string;
  }[];
}

export const defaultGalleryPageSettings: GalleryPageSettings = {
  hero: {
    isVisible: true,
    title: "The Gallery",
    description: "Explore the architectural elegance, exquisite interiors, and stunning surroundings of Hotel Luxury.",
    image: "https://images.unsplash.com/photo-1542314831-c53cd4b85d85?q=80&w=3270&auto=format&fit=crop",
    typography: {},
  },
  categories: [
    { id: "all", name: "All" },
    { id: "exterior", name: "Exterior" },
    { id: "interior", name: "Interior" },
    { id: "rooms", name: "Rooms & Suites" },
    { id: "dining", name: "Dining" },
    { id: "wellness", name: "Wellness" },
  ],
  images: [
    {
      id: "img-1",
      url: "/uploads/unsplash-1566073771259-6a8506099945.jpg",
      title: "Resort Exterior",
      categoryId: "exterior",
    },
    {
      id: "img-2",
      url: "/uploads/unsplash-1611892440504-42a792e24d32.jpg",
      title: "Luxury Suite Bedroom",
      categoryId: "rooms",
    },
    {
      id: "img-3",
      url: "/uploads/unsplash-1544161515-4ab6ce6db874.jpg",
      title: "Spa Massage Room",
      categoryId: "wellness",
    },
    {
      id: "img-4",
      url: "/uploads/unsplash-1514933651103-005eec06c04b.jpg",
      title: "Fine Dining Restaurant",
      categoryId: "dining",
    },
    {
      id: "img-5",
      url: "/uploads/unsplash-1578683010236-d716f9a3f461.jpg",
      title: "Grand Lobby",
      categoryId: "interior",
    },
    {
      id: "img-6",
      url: "/uploads/unsplash-1582719478250-c89cae4dc85b.jpg",
      title: "Presidential Suite Lounge",
      categoryId: "rooms",
    },
    {
      id: "img-7",
      url: "/uploads/unsplash-1540555700478-4be289fbecef.jpg",
      title: "Indoor Spa Pool",
      categoryId: "wellness",
    },
    {
      id: "img-8",
      url: "/uploads/unsplash-1571257121735-a7db2e38148f.jpg",
      title: "Thermal Baths",
      categoryId: "wellness",
    },
    {
      id: "img-9",
      url: "/uploads/unsplash-1551882547-ff40c0d5e9af.jpg",
      title: "Bar & Lounge",
      categoryId: "dining",
    },
  ],
};
