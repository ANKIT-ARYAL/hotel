export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqPageSettings {
  hero: {
    isVisible: boolean;
    title: string;
    subtitle: string;
    image?: string;
  };
  faqs: {
    isVisible: boolean;
    items: FaqItem[];
  };
}
