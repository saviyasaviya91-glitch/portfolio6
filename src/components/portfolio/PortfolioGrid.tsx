import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { useProjects } from "@/lib/data";

const DEFAULT_FILTERS = [
  { slug: "all", label: "All" },
  { slug: "web", label: "Web" },
  { slug: "design", label: "Design" },
];

export function PortfolioGrid({ onOpen }: { onOpen: (p: Project) => void }) {
  const projects = useProjects();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filters = useMemo(() => {
    if (!projects) return DEFAULT_FILTERS;
    const cats = new Set<string>();
    projects.forEach((p) => p.category && cats.add(p.category));
    const dynamic = Array.from(cats).map((c) => ({ slug: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
    return [{ slug: "all", label: "All" }, ...dynamic];
  }, [projects]);

  const visible = useMemo(() => {
    if (!projects) return [];
    const s = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (s && !(`${p.title} ${p.description ?? ""} ${p.category}`.toLowerCase().includes(s))) return false;
      return true;
    });
  }, [projects, filter, search]);

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">My Recent Work</h2>
          <p className="section-subtitle">Check out some of my latest projects</p>
        </div>

        <div className="portfolio-search">
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search projects"
          />
        </div>

        <div className="portfolio-filter">
          {filters.map((f) => (
            <button
              key={f.slug}
              className={`filter-btn ${filter === f.slug ? "active" : ""}`}
              onClick={() => setFilter(f.slug)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {projects === null ? (
          <div className="empty-state">Loading projects…</div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            {projects.length === 0
              ? "No projects yet. Add some from the admin panel."
              : "No projects match your search."}
          </div>
        ) : (
          <div className="portfolio-grid">
            {visible.map((p) => (
              <div className="portfolio-item" key={p.id}>
                <div className="portfolio-card" onClick={() => onOpen(p)}>
                  {p.mediaType === "video" ? (
                    <video className="portfolio-img" src={p.mediaUrl} muted playsInline preload="metadata" />
                  ) : (
                    <img src={p.mediaUrl} alt={p.title} className="portfolio-img" loading="lazy" />
                  )}
                  <div className="portfolio-overlay">
                    <h3 className="portfolio-title">{p.title}</h3>
                    <p className="portfolio-category">{p.categoryLabel || p.category}</p>
                    <div className="portfolio-links">
                      {p.liveUrl && (
                        <a href={p.liveUrl} className="portfolio-link" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                          <i className="fas fa-external-link-alt" /> Live
                        </a>
                      )}
                      {p.sourceUrl && (
                        <a href={p.sourceUrl} className="portfolio-link" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                          <i className="fab fa-github" /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
