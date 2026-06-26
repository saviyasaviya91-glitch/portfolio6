import { useEffect, useState } from "react";

const SECTIONS = ["home", "about", "services", "portfolio", "contact"] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      // section spy
      let current = "home";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && window.scrollY + 100 >= el.offsetTop) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="nav-container">
        <a href="#home" className="nav-logo" onClick={go("home")}>
          <span className="logo-text">VN</span>
        </a>
        <ul className={`nav-menu ${open ? "active" : ""}`}>
          {SECTIONS.map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                className={`nav-link ${active === s ? "active" : ""}`}
                onClick={go(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-controls">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
          </button>
          <button
            className={`hamburger ${open ? "active" : ""}`}
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>
    </nav>
  );
}
