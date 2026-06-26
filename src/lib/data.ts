import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, getDoc } from "firebase/firestore";
import { getDb } from "./firebase";
import type { Project, Testimonial, SiteSettings } from "./types";

const DEFAULT_SETTINGS: SiteSettings = {
  heroGreeting: "Welcome to my portfolio",
  heroName: "Vidusha Nethsara",
  heroSubtitle: "Creative Web Developer & Graphics Designer",
  typingPhrases: ["Web Developer", "Graphics Designer", "UI/UX Designer", "Creative Thinker"],
  statsProjects: 50,
  statsClients: 30,
  statsYears: 5,
  aboutTitle: "I'm a passionate developer & designer",
  aboutDescription1:
    "Hello! I'm Vidusha Nethsara, a creative web developer and graphics designer based in Sri Lanka. I specialize in creating beautiful, functional websites and stunning visual designs that help businesses stand out in the digital world.",
  aboutDescription2:
    "With over 5 years of experience in the industry, I've had the privilege of working with diverse clients from startups to established brands. My approach combines technical expertise with creative thinking to deliver solutions that not only look great but also drive results.",
  email: "vidushanethsara0405@gmail.com",
  phone: "+94 78 889 9434",
  location: "Colombo, Sri Lanka",
  social: { facebook: "#", instagram: "#", github: "#", linkedin: "#" },
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  useEffect(() => {
    const q = query(collection(getDb(), "projects"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) =>
        setProjects(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))),
      () => setProjects([]),
    );
  }, []);
  return projects;
}

export function useTestimonials() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  useEffect(() => {
    return onSnapshot(
      collection(getDb(), "testimonials"),
      (snap) =>
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }))),
      () => setItems([]),
    );
  }, []);
  return items;
}

export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    const ref = doc(getDb(), "settings", "site");
    let cancelled = false;
    getDoc(ref)
      .then((snap) => {
        if (!cancelled && snap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...(snap.data() as SiteSettings) });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return settings;
}

export { DEFAULT_SETTINGS };
