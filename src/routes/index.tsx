import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Preloader, CustomCursor, ScrollTopButton } from "@/components/portfolio/Chrome";
import { Hero } from "@/components/portfolio/Hero";
import { About, Services } from "@/components/portfolio/AboutServices";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { Contact, Footer } from "@/components/portfolio/ContactFooter";
import { ProjectModal } from "@/components/portfolio/ProjectModal";
import { useSettings } from "@/lib/data";
import type { Project } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vidusha Nethsara | Web Developer & Graphics Designer" },
      { name: "description", content: "Portfolio of Vidusha Nethsara - Creative Web Developer & Graphics Designer based in Sri Lanka." },
      { property: "og:title", content: "Vidusha Nethsara | Web Developer & Graphics Designer" },
      { property: "og:description", content: "Creative web development, UI/UX, and graphics design." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <ClientOnly fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a" }} />}>
      <HomeClient />
    </ClientOnly>
  );
}

function HomeClient() {
  const settings = useSettings();
  const [openProject, setOpenProject] = useState<Project | null>(null);
  return (
    <>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <Hero s={settings} />
      <About s={settings} />
      <Services />
      <PortfolioGrid onOpen={setOpenProject} />
      <Contact s={settings} />
      <Footer s={settings} />
      <ScrollTopButton />
      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </>
  );
}
