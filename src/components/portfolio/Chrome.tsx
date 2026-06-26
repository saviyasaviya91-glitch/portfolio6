import { useEffect, useState } from "react";

export function Preloader() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`preloader ${hidden ? "hidden" : ""}`} id="preloader">
      <div className="preloader-content">
        <div className="preloader-spinner" />
        <p className="preloader-text">Loading...</p>
      </div>
    </div>
  );
}

export function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = document.getElementById("cursor");
    const follower = document.getElementById("cursor-follower");
    if (!cursor || !follower) return;
    let fx = 0, fy = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      tx = e.clientX - 15; ty = e.clientY - 15;
    };
    let raf = 0;
    const loop = () => {
      fx += (tx - fx) * 0.15; fy += (ty - fy) * 0.15;
      follower.style.transform = `translate(${fx}px, ${fy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-follower" id="cursor-follower" />
    </>
  );
}

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={`scroll-top ${visible ? "visible" : ""}`}
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
}
