import { useCallback, useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/lib/toast";

export function MediaUploader({
  value,
  type,
  onChange,
}: {
  value: { url: string; type: "image" | "video" } | null;
  type?: "image" | "video";
  onChange: (v: { url: string; type: "image" | "video" } | null) => void;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const upload = useCallback(
    async (file: File) => {
      try {
        setProgress(0);
        const res = await uploadToCloudinary(file, (p) => setProgress(p));
        const t: "image" | "video" = res.resource_type === "video" ? "video" : "image";
        onChange({ url: res.secure_url, type: t });
        toast.push("Uploaded to Cloudinary");
      } catch (e) {
        toast.push((e as Error).message || "Upload failed", "error");
      } finally {
        setProgress(null);
      }
    },
    [onChange, toast],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  };

  return (
    <div>
      <div
        className={`dropzone ${dragging ? "dragging" : ""} ${value ? "has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {value ? (
          value.type === "video" ? (
            <video src={value.url} className="dropzone-preview" controls />
          ) : (
            <img src={value.url} alt="" className="dropzone-preview" />
          )
        ) : (
          <>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: 32, display: "block", marginBottom: 10 }} />
            <div>Click or drag to upload {type ?? "image/video"}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>Uploads directly to Cloudinary</div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "image/*,video/*"}
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
        />
      </div>
      {progress !== null && (
        <div className="upload-progress"><div style={{ width: `${progress}%` }} /></div>
      )}
      {value && (
        <button type="button" className="admin-btn danger" style={{ marginTop: 10 }} onClick={() => onChange(null)}>
          Remove
        </button>
      )}
    </div>
  );
}
