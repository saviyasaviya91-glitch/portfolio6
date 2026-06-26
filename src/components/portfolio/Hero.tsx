import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/types";

export function Hero({ s }: { s: SiteSettings }) {
  const phrases = s.typingPhrases?.length ? s.typingPhrases : ["Web Developer"];
  const [text, setText] = useState("");
  const phraseRef = useRef({ i: 0, j: 0, del: false });

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const cur = phrases[phraseRef.current.i % phrases.length];
      const { j, del } = phraseRef.current;
      const next = del ? j - 1 : j + 1;
      setText(cur.slice(0, next));
      phraseRef.current.j = next;
      if (!del && next === cur.length) {
        phraseRef.current.del = true;
        t = setTimeout(tick, 1500);
      } else if (del && next === 0) {
        phraseRef.current.del = false;
        phraseRef.current.i++;
        t = setTimeout(tick, 200);
      } else {
        t = setTimeout(tick, del ? 50 : 90);
      }
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.join("|")]);

  // particles
  useEffect(() => {
    const root = document.getElementById("particles");
    if (!root) return;
    root.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 15 + "s";
      p.style.animationDuration = 10 + Math.random() * 15 + "s";
      root.appendChild(p);
    }
  }, []);

  return (
    <section className="hero" id="home">
      <div className="particles" id="particles" />
      <div className="hero-gradient" />
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-greeting">{s.heroGreeting}</p>
          <h1 className="hero-title">
            Hi, I'm <span className="highlight">{s.heroName}</span>
          </h1>
          <div className="hero-typing">
            <span className="typing-text">{text}</span>
            <span className="typing-cursor">|</span>
          </div>
          <p className="hero-subtitle">{s.heroSubtitle}</p>
          <div className="hero-buttons">
            <a href="#portfolio" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span>View My Work</span><i className="fas fa-arrow-right" />
            </a>
            <a href="#contact" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span>Contact Me</span><i className="fas fa-envelope" />
            </a>
          </div>
        </div>
        <Stats projects={s.statsProjects ?? 50} clients={s.statsClients ?? 30} years={s.statsYears ?? 5} />
      </div>
      <div className="scroll-indicator">
        <div className="mouse"><div className="wheel" /></div>
        <p>Scroll Down</p>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const dur = 1500;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}+</>;
}

function Stats({ projects, clients, years }: { projects: number; clients: number; years: number }) {
  return (
    <div className="hero-stats">
      <div className="stat-item">
        <span className="stat-number"><Counter to={projects} /></span>
        <span className="stat-label">Projects Completed</span>
      </div>
      <div className="stat-item">
        <span className="stat-number"><Counter to={clients} /></span>
        <span className="stat-label">Happy Clients</span>
      </div>
      <div className="stat-item">
        <span className="stat-number"><Counter to={years} /></span>
        <span className="stat-label">Years Experience</span>
      </div>
    </div>
  );
}
