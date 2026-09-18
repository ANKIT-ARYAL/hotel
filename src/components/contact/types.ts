export interface ContactPageSettings {
  header: {
    title: string;
    subtitle: string;
    image: string;
  };
  contactInfo: {
    title: string;
    description: string;
  };
  location: {
    title: string;
    address: string;
  };
  phone: {
    title: string;
    number: string;
    availability: string;
  };
  email: {
    title: string;
    address: string;
  };
  mapEmbedUrl: string;
}

export const defaultContactPageSettings: ContactPageSettings = {
  header: {
    title: "Contact Us",
    subtitle:
      "We are here to assist you with any inquiries or special requests. Please feel free to reach out to our dedicated team.",
    image: "https://images.unsplash.com/photo-1542314831-c6a4d27ce669?q=80&w=3270&auto=format&fit=crop",
  },
  contactInfo: {
    title: "Get in Touch",
    description:
      "Whether you're planning your next stay, organizing an event, or simply have a question, our team is ready to provide you with the highest level of service.",
  },
  location: {
    title: "Our Location",
    address: "123 Luxury Avenue\nMetropolis, NY 10001\nUnited States",
  },
  phone: {
    title: "Phone",
    number: "+1 (555) 123-4567",
    availability: "Available 24/7",
  },
  email: {
    title: "Email",
    address: "reservations@thehotel.com",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25279998188!2d-74.1444876615701!3d40.69763123340578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snp!4v1714571026043!5m2!1sen!2snp",
};
