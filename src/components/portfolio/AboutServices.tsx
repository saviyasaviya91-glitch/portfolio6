import { useEffect, useRef } from "react";
import type { SiteSettings } from "@/lib/types";

const SKILLS = [
  { name: "HTML", icon: "fab fa-html5", pct: 95 },
  { name: "CSS", icon: "fab fa-css3-alt", pct: 95 },
  { name: "JavaScript", icon: "fab fa-js", pct: 88 },
  { name: "React", icon: "fab fa-react", pct: 85 },
  { name: "Photoshop", icon: "fas fa-palette", pct: 92 },
  { name: "Illustrator", icon: "fas fa-pen-nib", pct: 82 },
];

export function About({ s }: { s: SiteSettings }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>(".skill-progress").forEach((b) => {
              b.style.width = b.dataset.width + "%";
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">Who Am I?</h2>
          <p className="section-subtitle">Get to know me better</p>
        </div>
        <div className="about-content">
          <div className="about-image">
            <div className="image-frame">
              <img
                src={s.profileImageUrl || "https://res.cloudinary.com/dtrukaktg/image/upload/v1/sample.jpg"}
                alt={s.heroName}
                className="profile-img"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><rect fill='%23161616' width='400' height='500'/><text fill='%2300ff88' font-family='sans-serif' font-size='24' x='50%' y='50%' text-anchor='middle'>Add profile image</text></svg>"; }}
              />
              <div className="image-glow" />
            </div>
            <div className="experience-badge">
              <span className="exp-number">{s.statsYears ?? 5}+</span>
              <span className="exp-text">Years<br />Experience</span>
            </div>
          </div>
          <div className="about-text">
            <h3 className="about-title">{s.aboutTitle}</h3>
            <p className="about-description">{s.aboutDescription1}</p>
            <p className="about-description">{s.aboutDescription2}</p>
            <div className="about-info">
              <div className="info-item"><i className="fas fa-user" /><span><strong>Name:</strong> {s.heroName}</span></div>
              <div className="info-item"><i className="fas fa-envelope" /><span><strong>Email:</strong> {s.email}</span></div>
              <div className="info-item"><i className="fas fa-map-marker-alt" /><span><strong>Location:</strong> {s.location}</span></div>
              <div className="info-item"><i className="fas fa-briefcase" /><span><strong>Availability:</strong> Open to work</span></div>
            </div>
            {s.cvUrl && (
              <a href={s.cvUrl} className="btn btn-primary" download target="_blank" rel="noreferrer">
                <span>Download CV</span><i className="fas fa-download" />
              </a>
            )}
          </div>
        </div>
        <div className="skills-section" ref={ref}>
          <h3 className="skills-title">My Skills</h3>
          <div className="skills-grid">
            {SKILLS.map((sk) => (
              <div className="skill-item" key={sk.name}>
                <div className="skill-header">
                  <span className="skill-name"><i className={sk.icon} /> {sk.name}</span>
                  <span className="skill-percent">{sk.pct}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" data-width={sk.pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const items = [
    { icon: "fas fa-code", title: "Web Development", desc: "I build modern, responsive, and high-performance websites using the latest technologies. From landing pages to complex web applications, I deliver solutions that exceed expectations.", features: ["Responsive Design", "Clean Code", "SEO Optimized"] },
    { icon: "fas fa-laptop", title: "UI/UX Design", desc: "I create intuitive and visually appealing user interfaces that provide excellent user experiences. My designs are user-centered and focused on achieving business goals.", features: ["User Research", "Wireframing", "Prototyping"] },
    { icon: "fas fa-paint-brush", title: "Graphics Design", desc: "I design stunning visuals including logos, branding materials, social media graphics, and marketing collateral that help your brand make a lasting impression.", features: ["Logo Design", "Brand Identity", "Print Design"] },
  ];
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Services</span>
          <h2 className="section-title">What I Do</h2>
          <p className="section-subtitle">Services I offer to my clients</p>
        </div>
        <div className="services-grid">
          {items.map((it) => (
            <div className="service-card" key={it.title}>
              <div className="service-icon"><i className={it.icon} /></div>
              <h3 className="service-title">{it.title}</h3>
              <p className="service-description">{it.desc}</p>
              <ul className="service-features">
                {it.features.map((f) => (
                  <li key={f}><i className="fas fa-check" /> {f}</li>
                ))}
              </ul>
              <div className="service-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
