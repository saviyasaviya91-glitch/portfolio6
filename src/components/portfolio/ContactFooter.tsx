import { useState } from "react";
import type { SiteSettings } from "@/lib/types";

export function Contact({ s }: { s: SiteSettings }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xykdddwe", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const sl = s.social ?? {};
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Let's work together on your next project</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h3 className="contact-info-title">Let's discuss your project</h3>
            <p className="contact-info-text">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-envelope" /></div>
                <div className="contact-text"><span className="contact-label">Email</span><span className="contact-value">{s.email}</span></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-phone" /></div>
                <div className="contact-text"><span className="contact-label">Phone</span><span className="contact-value">{s.phone}</span></div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-map-marker-alt" /></div>
                <div className="contact-text"><span className="contact-label">Location</span><span className="contact-value">{s.location}</span></div>
              </div>
            </div>
            <div className="social-links">
              {sl.facebook && <a href={sl.facebook} className="social-link" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>}
              {sl.instagram && <a href={sl.instagram} className="social-link" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram" /></a>}
              {sl.github && <a href={sl.github} className="social-link" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github" /></a>}
              {sl.linkedin && <a href={sl.linkedin} className="social-link" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>}
            </div>
          </div>
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input id="name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" rows={5} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project..." required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={status === "sending"}>
                <span>{status === "sending" ? "Sending..." : "Send Message"}</span>
                <i className="fas fa-paper-plane" />
              </button>
              {status === "success" && (
                <div className="form-success show">
                  <i className="fas fa-check-circle" />
                  <p>Thank you! Your message has been sent successfully.</p>
                </div>
              )}
              {status === "error" && (
                <div className="form-error show" style={{ display: "block" }}>Something went wrong. Please try again.</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ s }: { s: SiteSettings }) {
  const sl = s.social ?? {};
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#" className="footer-logo"><span className="logo-text">VN</span></a>
            <p className="footer-tagline">Creating digital experiences that matter</p>
          </div>
          <div className="footer-links">
            {["home","about","services","portfolio","contact"].map((id) => (
              <a key={id} href={`#${id}`} className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
          <div className="footer-social">
            {sl.facebook && <a href={sl.facebook} className="footer-social-link" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>}
            {sl.instagram && <a href={sl.instagram} className="footer-social-link" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram" /></a>}
            {sl.github && <a href={sl.github} className="footer-social-link" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github" /></a>}
            {sl.linkedin && <a href={sl.linkedin} className="footer-social-link" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} {s.heroName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
