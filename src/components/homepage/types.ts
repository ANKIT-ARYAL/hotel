export interface HomepageSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    headingFontFamily: string;
    headingFontSize?: string;
    adminHeadingFontSize?: string;
    bodyFontSize?: string;
  };
  loader: {
    isVisible: boolean;
    iconUrl: string;
  };
  hero: {
    isVisible: boolean;
    title: string;
    subtitle: string;
    videoUrl: string;
    image?: string;
    backgroundImageFallback: string;
    buttonLabel: string;
    titleSize: string;
    subtitleSize: string;
  };
  searchHero: {
    isVisible: boolean;
    videoUrl: string;
  };
  featuredRooms: {
    isVisible: boolean;
    title: string;
    description: string;
    rooms: {
      id: string;
      name: string;
      description: string;
      image: string;
      price: number;
      amenities: string[];
    }[];
  };
  culinary: {
    isVisible: boolean;
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
  };
  spaWellness: {
    isVisible: boolean;
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
  };
  amenities: {
    isVisible: boolean;
    title: string;
    description: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  testimonials: {
    isVisible: boolean;
    title: string;
    items: {
      name: string;
      role: string;
      quote: string;
      rating: number;
    }[];
  };
  experiences: {
    isVisible: boolean;
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
  };
  ourStory: {
    isVisible: boolean;
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
  };
  bookingCta: {
    isVisible: boolean;
    title: string;
    description: string;
    buttonLabel: string;
    image: string;
  };
  footer: {
    isVisible: boolean;
    brandDescription: string;
    address: string;
    phone: string;
    email: string;
    copyright: string;
    socialLinks: {
      id: string;
      platform: string;
      url: string;
      isVisible: boolean;
    }[];
    exploreLinks: {
      id: string;
      label: string;
      href: string;
      isVisible: boolean;
    }[];
    quickLinks: {
      id: string;
      label: string;
      href: string;
      isVisible: boolean;
    }[];
  };
}

export const defaultHomepageSettings: HomepageSettings = {
  theme: {
    primaryColor: "bg-zinc-900",
    secondaryColor: "bg-zinc-100",
    fontFamily: "font-sans",
    headingFontFamily: "font-argine",
    headingFontSize: "1rem",
    adminHeadingFontSize: "1.875rem",
    bodyFontSize: "16px",
  },
  loader: {
    isVisible: true,
    iconUrl: "/next.svg",
  },
  hero: {
    isVisible: true,
    title: "Where Elegance Meets Exceptional Service",
    subtitle:
      "Step into a world of refined beauty and uncompromising comfort. Your extraordinary journey begins the moment you arrive.",
    videoUrl: "https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4",
    image: "",
    backgroundImageFallback:
      "https://images.unsplash.com/photo-1542314831-c53cd4b85d85?q=80&w=3270&auto=format&fit=crop",
    buttonLabel: "Reserve Your Experience",
    titleSize: "text-6xl md:text-8xl leading-tight",
    subtitleSize: "text-lg md:text-xl font-light",
  },
  searchHero: {
    isVisible: true,
    videoUrl: "/uploads/1789297793949-797680564.mp4",
  },
  featuredRooms: {
    isVisible: true,
    title: "Featured Accommodations",
    description: "Experience comfort and luxury in our meticulously designed rooms and suites.",
    rooms: [
      {
        id: "1",
        name: "Ocean View Suite",
        description: "Wake up to breathtaking views of the ocean in our signature suite.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=3270&auto=format&fit=crop",
        price: 450,
        amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar"],
      },
      {
        id: "2",
        name: "Executive Room",
        description: "Perfect for business travelers seeking comfort and productivity.",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=3270&auto=format&fit=crop",
        price: 280,
        amenities: ["Queen Bed", "City View", "Desk", "Free WiFi"],
      },
      {
        id: "3",
        name: "Presidential Penthouse",
        description: "The ultimate luxury experience with panoramic views and premium services.",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=3270&auto=format&fit=crop",
        price: 1200,
        amenities: ["King Bed", "Panoramic View", "Private Jacuzzi", "Butler Service"],
      },
      {
        id: "4",
        name: "Superior Room",
        description: "Elegantly appointed room where refinement meets contemporary style.",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop",
        price: 320,
        amenities: ["King Bed", "City View", "Lounge Area", "Free WiFi"],
      },
      {
        id: "5",
        name: "Superior Accessible Room",
        description: "Thoughtfully designed for both relaxation and connection with accessible features.",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=3270&auto=format&fit=crop",
        price: 320,
        amenities: ["King Bed", "Accessible", "City View", "Roll-in Shower"],
      },
      {
        id: "6",
        name: "Superior Double Room",
        description: "Perfect for families or groups, featuring two comfortable double beds.",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=3270&auto=format&fit=crop",
        price: 350,
        amenities: ["2 Double Beds", "City View", "Bathtub", "Free WiFi"],
      },
      {
        id: "7",
        name: "Deluxe Harbour View",
        description: "Enjoy sweeping views of the harbor from this elevated deluxe room.",
        image: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?q=80&w=3270&auto=format&fit=crop",
        price: 480,
        amenities: ["King Bed", "Harbour View", "Balcony", "Espresso Machine"],
      },
      {
        id: "8",
        name: "Club Millésime Room",
        description: "Exclusive access to our Club Lounge with complimentary breakfast and evening canapés.",
        image: "https://images.unsplash.com/photo-1598928506311-c55dd5802c27?q=80&w=3270&auto=format&fit=crop",
        price: 550,
        amenities: ["King Bed", "High Floor", "Club Access", "City View"],
      },
      {
        id: "9",
        name: "Family Suite",
        description: "Spacious suite designed for families, featuring a separate living area.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=3270&auto=format&fit=crop",
        price: 650,
        amenities: ["King Bed & Sofa Bed", "Kitchenette", "City View", "2 Bathrooms"],
      },
      {
        id: "10",
        name: "Royal Suite",
        description: "Our most prestigious accommodation offering unparalleled luxury and space.",
        image: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=3270&auto=format&fit=crop",
        price: 2500,
        amenities: ["King Bed", "Panoramic Ocean View", "Dining Room", "24/7 Butler"],
      },
    ],
  },
  culinary: {
    isVisible: true,
    title: "Culinary Excellence",
    description:
      "Embark on a gastronomic journey with our award-winning chefs. From authentic local flavors to exquisite international cuisine, every dish is a masterpiece designed to delight your senses.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3270&auto=format&fit=crop",
    buttonLabel: "Explore Dining",
  },
  spaWellness: {
    isVisible: true,
    title: "Spa & Wellness",
    description:
      "Rejuvenate your body and soul in our tranquil sanctuary. Offering personalized treatments, state-of-the-art facilities, and holistic therapies to restore your inner balance.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=3270&auto=format&fit=crop",
    buttonLabel: "View Treatments",
  },
  amenities: {
    isVisible: true,
    title: "World-Class Amenities",
    description: "Everything you need for a perfect stay is right here.",
    items: [
      {
        icon: "Wifi",
        title: "High-Speed WiFi",
        description: "Stay connected with complimentary high-speed internet throughout the hotel.",
      },
      {
        icon: "Coffee",
        title: "Premium Coffee",
        description: "Enjoy artisanal coffee and pastries at our lobby cafe.",
      },
      {
        icon: "Utensils",
        title: "Fine Dining",
        description: "Experience culinary excellence at our award-winning restaurants.",
      },
      {
        icon: "Dumbbell",
        title: "Fitness Center",
        description: "Keep up with your fitness routine in our state-of-the-art gym.",
      },
    ],
  },
  testimonials: {
    isVisible: true,
    title: "What Our Guests Say",
    items: [
      {
        name: "Sarah Johnson",
        role: "Business Traveler",
        quote: "An absolutely incredible stay. The service was impeccable and the room was stunning.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Vacationer",
        quote: "The best hotel experience I have ever had. The attention to detail is unmatched.",
        rating: 5,
      },
      {
        name: "Emma Williams",
        role: "Honeymooner",
        quote: "Perfect romantic getaway. The ocean view suite exceeded all our expectations.",
        rating: 5,
      },
    ],
  },
  experiences: {
    isVisible: true,
    title: "Bespoke Experiences",
    description:
      "Immerse yourself in curated activities designed to elevate your stay. From private yacht charters to exclusive wine tastings, every moment is crafted to perfection.",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=3270&auto=format&fit=crop",
    buttonLabel: "Discover More",
  },
  ourStory: {
    isVisible: true,
    title: "A Legacy of Elegance",
    description:
      "Since 1924, Hotel Luxury has been the pinnacle of extraordinary hospitality. Our walls hold the stories of dignitaries, artists, and lovers who have sought refuge in our timeless embrace.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c0d12c56?q=80&w=3270&auto=format&fit=crop",
    buttonLabel: "Read Our Story",
  },
  bookingCta: {
    isVisible: true,
    title: "Your Extraordinary Journey Awaits",
    description: "Reserve your unparalleled experience today and step into a world of refined beauty.",
    buttonLabel: "Book Your Stay",
    image: "https://images.unsplash.com/photo-1618773928120-2c7096e23b88?q=80&w=3270&auto=format&fit=crop",
  },
  footer: {
    isVisible: true,
    brandDescription: "Experience the pinnacle of hospitality. Where every stay is a story worth telling.",
    address: "123 Luxury Ave, Resort City, RC 12345",
    phone: "+1 (555) 123-4567",
    email: "reservations@hotel.com",
    copyright: "© 2026 Hotel Luxury. All rights reserved.",
    socialLinks: [
      { id: "1", platform: "twitter", url: "#", isVisible: true },
      { id: "2", platform: "instagram", url: "#", isVisible: true },
      { id: "3", platform: "facebook", url: "#", isVisible: true },
    ],
    exploreLinks: [
      { id: "1", label: "Rooms & Suites", href: "/rooms-and-suites", isVisible: true },
      { id: "2", label: "Dining", href: "/dining", isVisible: true },
      { id: "3", label: "Spa & Wellness", href: "/spa", isVisible: true },      
      { id: "4", label: "Gallery", href: "/gallery", isVisible: true },
    ],
    quickLinks: [
      { id: "1", label: "About Us", href: "/about", isVisible: true },
      { id: "2", label: "Contact Us", href: "/contact", isVisible: true },
      { id: "3", label: "Terms & Conditions", href: "/terms", isVisible: true },
      { id: "4", label: "Privacy Policy", href: "/privacy", isVisible: true },
      { id: "5", label: "FAQs", href: "/faq", isVisible: true },
    ],
  },
};
