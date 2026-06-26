import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ADMIN_UID, getDb, getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { ToastProvider, useToast } from "@/lib/toast";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DEFAULT_SETTINGS } from "@/lib/data";
import type { Project, SiteSettings, Testimonial } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="admin-shell">Loading…</div>}>
      <ToastProvider>
        <AdminRoot />
      </ToastProvider>
    </ClientOnly>
  ),
});

function AdminRoot() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="admin-shell">Loading…</div>;
  if (!user) return <Login />;
  if (!isAdmin) return <AccessDenied />;
  return <Dashboard />;
}

function Login() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      toast.push("Signed in");
    } catch (err) {
      toast.push((err as Error).message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = async () => {
    if (!email) { toast.push("Enter your email first", "error"); return; }
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      toast.push("Password reset email sent");
    } catch (e) {
      toast.push((e as Error).message, "error");
    }
  };

  return (
    <div className="admin-shell">
      <form className="admin-login" onSubmit={submit}>
        <h1>Admin Login</h1>
        <p>Restricted area. Authorized personnel only.</p>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
        </div>
        <div className="form-group" style={{ marginBottom: 18 }}>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
        </div>
        <button className="btn btn-primary btn-full" disabled={submitting}>
          <span>{submitting ? "Signing in..." : "Sign In"}</span>
          <i className="fas fa-sign-in-alt" />
        </button>
        <button type="button" className="admin-btn" style={{ marginTop: 12, width: "100%" }} onClick={reset}>
          Forgot password?
        </button>
      </form>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="admin-shell">
      <div className="admin-login">
        <h1>Access Denied</h1>
        <p>Your account is not authorized to access this panel.</p>
        <button className="btn btn-secondary btn-full" onClick={() => signOut(getFirebaseAuth())}>
          <span>Sign out</span><i className="fas fa-sign-out-alt" />
        </button>
      </div>
    </div>
  );
}

type Tab = "projects" | "testimonials" | "settings";

function Dashboard() {
  const [tab, setTab] = useState<Tab>("projects");
  const { user } = useAuth();
  return (
    <div className="admin-shell">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Portfolio Admin</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{user?.email}</span>
            <button className="admin-btn" onClick={() => signOut(getFirebaseAuth())}>
              <i className="fas fa-sign-out-alt" /> Sign out
            </button>
          </div>
        </div>
        <div className="admin-tabs">
          {(["projects", "testimonials", "settings"] as Tab[]).map((t) => (
            <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {tab === "projects" && <ProjectsTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

/* ---------------- Projects ---------------- */

function ProjectsTab() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    return onSnapshot(collection(getDb(), "projects"), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) })));
    });
  }, []);

  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await deleteDoc(doc(getDb(), "projects", p.id));
      toast.push("Project deleted");
    } catch (e) { toast.push((e as Error).message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20 }}>Projects ({items.length})</h2>
        <button className="admin-btn primary" onClick={() => setCreating(true)}>
          <i className="fas fa-plus" /> Add Project
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">No projects yet. Click "Add Project".</div>
      ) : (
        <div className="admin-grid">
          {items.map((p) => (
            <div className="admin-project-card" key={p.id}>
              {p.mediaType === "video" ? (
                <video src={p.mediaUrl} muted />
              ) : (
                <img src={p.mediaUrl} alt={p.title} />
              )}
              <div className="admin-project-body">
                <h4>{p.title}</h4>
                <p>{p.categoryLabel || p.category}</p>
                <div className="admin-actions">
                  <button className="admin-btn" onClick={() => setEditing(p)}>Edit</button>
                  <button className="admin-btn danger" onClick={() => remove(p)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <ProjectEditor
          initial={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ProjectEditor({ initial, onClose }: { initial: Project | null; onClose: () => void }) {
  const toast = useToast();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "web");
  const [categoryLabel, setCategoryLabel] = useState(initial?.categoryLabel ?? "Web Development");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? "");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" } | null>(
    initial ? { url: initial.mediaUrl, type: initial.mediaType } : null,
  );
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !media) { toast.push("Title and media required", "error"); return; }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        category: category.trim().toLowerCase(),
        categoryLabel: categoryLabel.trim(),
        description: description.trim(),
        liveUrl: liveUrl.trim() || null,
        sourceUrl: sourceUrl.trim() || null,
        mediaUrl: media.url,
        mediaType: media.type,
      };
      if (initial) {
        await updateDoc(doc(getDb(), "projects", initial.id), payload);
        toast.push("Updated");
      } else {
        await addDoc(collection(getDb(), "projects"), { ...payload, createdAt: Date.now() });
        toast.push("Created");
      }
      onClose();
    } catch (e) { toast.push((e as Error).message, "error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
        <button className="project-modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        <form className="project-modal-body" onSubmit={save}>
          <h2 style={{ marginBottom: 20 }}>{initial ? "Edit" : "New"} Project</h2>

          <div style={{ display: "grid", gap: 16 }}>
            <MediaUploader value={media} onChange={setMedia} />

            <div className="form-group">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>Category slug</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="web / design" />
              </div>
              <div className="form-group">
                <label>Category label</label>
                <input value={categoryLabel} onChange={(e) => setCategoryLabel(e.target.value)} placeholder="Web Development" />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>Live URL</label>
                <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://" />
              </div>
              <div className="form-group">
                <label>Source URL</label>
                <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://github.com/..." />
              </div>
            </div>
            <button className="btn btn-primary" disabled={saving}>
              <span>{saving ? "Saving..." : initial ? "Update Project" : "Create Project"}</span>
              <i className="fas fa-save" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Testimonials ---------------- */

function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const toast = useToast();

  useEffect(() => {
    return onSnapshot(collection(getDb(), "testimonials"), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) })));
    });
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    try {
      await addDoc(collection(getDb(), "testimonials"), {
        name: name.trim(),
        role: role.trim(),
        message: message.trim(),
        avatarUrl: avatar?.url || null,
        createdAt: serverTimestamp(),
      });
      setName(""); setRole(""); setMessage(""); setAvatar(null);
      toast.push("Testimonial added");
    } catch (e) { toast.push((e as Error).message, "error"); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    await deleteDoc(doc(getDb(), "testimonials", id));
  };

  return (
    <div>
      <div className="admin-card">
        <h3>Add testimonial</h3>
        <form onSubmit={add} style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="form-group"><label>Role / Company</label><input value={role} onChange={(e) => setRole(e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Message</label><textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={500} /></div>
          <div>
            <label style={{ fontSize: 14, display: "block", marginBottom: 8 }}>Avatar (optional)</label>
            <MediaUploader type="image" value={avatar} onChange={setAvatar} />
          </div>
          <button className="btn btn-primary"><span>Add</span><i className="fas fa-plus" /></button>
        </form>
      </div>

      <div className="admin-grid">
        {items.map((t) => (
          <div className="admin-project-card" key={t.id}>
            {t.avatarUrl && <img src={t.avatarUrl} alt={t.name} />}
            <div className="admin-project-body">
              <h4>{t.name}</h4>
              <p>{t.role}</p>
              <p style={{ marginBottom: 12 }}>"{t.message}"</p>
              <button className="admin-btn danger" onClick={() => remove(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */

function SettingsTab() {
  const toast = useToast();
  const [s, setS] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{ url: string; type: "image" | "video" } | null>(null);

  useEffect(() => {
    return onSnapshot(doc(getDb(), "settings", "site"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SiteSettings;
        setS({ ...DEFAULT_SETTINGS, ...data });
        if (data.profileImageUrl) setProfile({ url: data.profileImageUrl, type: "image" });
      }
      setLoaded(true);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const raw = { ...s, profileImageUrl: profile?.url || null };
      // Firestore rejects undefined values; coerce to null.
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(raw)) clean[k] = v === undefined ? null : v;
      await setDoc(doc(getDb(), "settings", "site"), clean);
      toast.push("Settings saved");
    } catch (e) { toast.push((e as Error).message, "error"); }
    finally { setSaving(false); }
  };

  if (!loaded) return <div className="empty-state">Loading…</div>;
  const set = (k: keyof SiteSettings, v: unknown) => setS((prev) => ({ ...prev, [k]: v }));
  const sl = s.social ?? {};
  const setSl = (k: keyof NonNullable<SiteSettings["social"]>, v: string) =>
    setS((prev) => ({ ...prev, social: { ...prev.social, [k]: v } }));

  return (
    <form onSubmit={save}>
      <div className="admin-card">
        <h3>Hero section</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <div className="form-group"><label>Greeting</label><input value={s.heroGreeting ?? ""} onChange={(e) => set("heroGreeting", e.target.value)} /></div>
          <div className="form-group"><label>Name</label><input value={s.heroName ?? ""} onChange={(e) => set("heroName", e.target.value)} /></div>
          <div className="form-group"><label>Subtitle</label><input value={s.heroSubtitle ?? ""} onChange={(e) => set("heroSubtitle", e.target.value)} /></div>
          <div className="form-group">
            <label>Typing phrases (comma-separated)</label>
            <input
              value={(s.typingPhrases ?? []).join(", ")}
              onChange={(e) => set("typingPhrases", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div className="form-group"><label>Projects #</label><input type="number" value={s.statsProjects ?? 0} onChange={(e) => set("statsProjects", Number(e.target.value))} /></div>
            <div className="form-group"><label>Clients #</label><input type="number" value={s.statsClients ?? 0} onChange={(e) => set("statsClients", Number(e.target.value))} /></div>
            <div className="form-group"><label>Years #</label><input type="number" value={s.statsYears ?? 0} onChange={(e) => set("statsYears", Number(e.target.value))} /></div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>About section</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ fontSize: 14, display: "block", marginBottom: 8 }}>Profile image</label>
            <MediaUploader type="image" value={profile} onChange={setProfile} />
          </div>
          <div className="form-group"><label>About title</label><input value={s.aboutTitle ?? ""} onChange={(e) => set("aboutTitle", e.target.value)} /></div>
          <div className="form-group"><label>Paragraph 1</label><textarea rows={3} value={s.aboutDescription1 ?? ""} onChange={(e) => set("aboutDescription1", e.target.value)} /></div>
          <div className="form-group"><label>Paragraph 2</label><textarea rows={3} value={s.aboutDescription2 ?? ""} onChange={(e) => set("aboutDescription2", e.target.value)} /></div>
          <div className="form-group"><label>CV download URL (Cloudinary or any link)</label><input value={s.cvUrl ?? ""} onChange={(e) => set("cvUrl", e.target.value)} /></div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Contact info</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-group"><label>Email</label><input value={s.email ?? ""} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="form-group"><label>Phone</label><input value={s.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Location</label><input value={s.location ?? ""} onChange={(e) => set("location", e.target.value)} /></div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Social links</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-group"><label>Facebook</label><input value={sl.facebook ?? ""} onChange={(e) => setSl("facebook", e.target.value)} /></div>
          <div className="form-group"><label>Instagram</label><input value={sl.instagram ?? ""} onChange={(e) => setSl("instagram", e.target.value)} /></div>
          <div className="form-group"><label>GitHub</label><input value={sl.github ?? ""} onChange={(e) => setSl("github", e.target.value)} /></div>
          <div className="form-group"><label>LinkedIn</label><input value={sl.linkedin ?? ""} onChange={(e) => setSl("linkedin", e.target.value)} /></div>
        </div>
      </div>

      <button className="btn btn-primary" disabled={saving} style={{ marginBottom: 60 }}>
        <span>{saving ? "Saving..." : "Save All Settings"}</span>
        <i className="fas fa-save" />
      </button>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
        Admin UID: <code>{ADMIN_UID}</code>
      </div>
    </form>
  );
}
