export interface UserDashboardSettings {
  hero: { isVisible: boolean; title: string; subtitle: string; image: string };
  bookings: { isVisible: boolean; title: string; description: string };
  services: { isVisible: boolean; title: string; description: string };
  activity: { isVisible: boolean; title: string; description: string };
}

export const defaultUserDashboardSettings: UserDashboardSettings = {
  hero: { isVisible: true, title: "Welcome back", subtitle: "View your stay, service requests, and reservation history.", image: "/uploads/unsplash-1540555700478-4be289fbecef.jpg" },
  bookings: { isVisible: true, title: "Your bookings", description: "Review your current and previous stays." },
  services: { isVisible: true, title: "Hotel services", description: "Request spa treatments and reserve dining experiences." },
  activity: { isVisible: true, title: "Your activity", description: "Track your spa and dining reservations." },
};
