import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      setFullscreen(false);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal"
        style={{ position: "relative", maxWidth: fullscreen ? "100vw" : 900, maxHeight: fullscreen ? "100vh" : "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="project-modal-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-times" />
        </button>
        {project.mediaType === "video" ? (
          <video className="project-modal-media" src={project.mediaUrl} controls autoPlay />
        ) : (
          <img
            className="project-modal-media"
            src={project.mediaUrl}
            alt={project.title}
            style={{ maxHeight: fullscreen ? "100vh" : "60vh", cursor: "zoom-in" }}
            onClick={() => setFullscreen((v) => !v)}
          />
        )}
        <div className="project-modal-body">
          <h2>{project.title}</h2>
          <p className="project-modal-cat">{project.categoryLabel || project.category}</p>
          {project.description && <p className="project-modal-desc">{project.description}</p>}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <span>Live Demo</span><i className="fas fa-external-link-alt" />
              </a>
            )}
            {project.sourceUrl && (
              <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                <span>Source</span><i className="fab fa-github" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
