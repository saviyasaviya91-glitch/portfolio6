export interface Project {
  id: string;
  title: string;
  category: string; // slug, e.g. "web", "design"
  categoryLabel?: string; // display label
  description?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  liveUrl?: string;
  sourceUrl?: string;
  createdAt?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  message: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  slug: string;
  label: string;
}

export interface SiteSettings {
  heroGreeting?: string;
  heroName?: string;
  heroSubtitle?: string;
  typingPhrases?: string[];
  statsProjects?: number;
  statsClients?: number;
  statsYears?: number;
  aboutTitle?: string;
  aboutDescription1?: string;
  aboutDescription2?: string;
  profileImageUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  cvUrl?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
}
