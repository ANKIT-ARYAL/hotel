export interface AboutPageSettings {
  hero: {
    isVisible: boolean;
    title: string;
    subtitle: string;
    image: string;
  };
  ourStory: {
    isVisible: boolean;
    title: string;
    content: string;
    image1: string;
    image2: string;
  };
  coreValues: {
    isVisible: boolean;
    title: string;
    subtitle: string;
    values: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  team: {
    isVisible: boolean;
    title: string;
    subtitle: string;
    members: {
      name: string;
      role: string;
      image: string;
    }[];
  };
  contactBlock: {
    isVisible: boolean;
    title: string;
    description: string;
    phone: string;
    email: string;
    buttonLabel: string;
  };
}

export const defaultAboutPageSettings: AboutPageSettings = {
  hero: {
    isVisible: true,
    title: "Our Heritage",
    subtitle: "A legacy of uncompromising luxury and timeless elegance.",
    image: "https://images.unsplash.com/photo-1542314831-c53cd4b85d85?q=80&w=3270&auto=format&fit=crop",
  },
  ourStory: {
    isVisible: true,
    title: "A Story of Excellence",
    content:
      "<p>Since our founding, Hotel Luxury has been synonymous with unparalleled hospitality. What began as a grand vision has blossomed into an iconic sanctuary for global travelers.</p><p>We believe in the art of hospitality, where every detail is meticulously curated to create moments that linger long after our guests depart.</p>",
    image1: "https://images.unsplash.com/photo-1551882547-ff40c0d12c56?q=80&w=3270&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=3270&auto=format&fit=crop",
  },
  coreValues: {
    isVisible: true,
    title: "Our Core Values",
    subtitle: "The principles that guide every interaction and experience at Hotel Luxury.",
    values: [
      {
        title: "Unwavering Excellence",
        description: "We accept nothing less than perfection in our service and our spaces.",
        icon: "Star",
      },
      {
        title: "Authentic Connection",
        description: "We forge genuine relationships with our guests to anticipate their every need.",
        icon: "Heart",
      },
      {
        title: "Timeless Elegance",
        description: "We honor our heritage while embracing modern comforts and sustainable practices.",
        icon: "Gem",
      },
    ],
  },
  team: {
    isVisible: true,
    title: "The Visionaries",
    subtitle: "Meet the passionate individuals dedicated to orchestrating your perfect stay.",
    members: [
      {
        name: "Eleanor Sterling",
        role: "General Manager",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3270&auto=format&fit=crop",
      },
      {
        name: "Julian Vance",
        role: "Executive Chef",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=3270&auto=format&fit=crop",
      },
      {
        name: "Sophia Laurent",
        role: "Director of Guest Experience",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3270&auto=format&fit=crop",
      },
    ],
  },
  contactBlock: {
    isVisible: true,
    title: "Begin Your Journey",
    description: "We look forward to welcoming you to an unforgettable experience.",
    phone: "+1 (555) 123-4567",
    email: "reservations@hotel.com",
    buttonLabel: "Contact Us",
  },
};
