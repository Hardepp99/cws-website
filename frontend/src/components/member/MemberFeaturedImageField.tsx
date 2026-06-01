"use client";

import { useId, useRef, useState } from "react";
import { ImageUploadGuide } from "@/components/admin/media/ImageUploadGuide";
import { getImageUploadGuide } from "@/lib/admin/image-upload-guides";
import { memberUploadImage } from "@/lib/member/client";

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

type MemberFeaturedImageFieldProps = {
  value: string;
  onChange: (url: string) => void;
  postTitle?: string;
};

export function MemberFeaturedImageField({ value, onChange, postTitle = "" }: MemberFeaturedImageFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const guide = getImageUploadGuide("blogFeatured");

  async function onFileChange(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const base = postTitle.trim() || file.name.replace(/\.[^.]+$/, "");
      const { url } = await memberUploadImage(file, {
        title: base,
        altText: base,
      });
      onChange(url);
    } catch (e) {
      setErr(String(e));
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="member-featured-image mb-3">
      <label className="form-label" htmlFor={inputId}>
        Featured image <span className="text-muted fw-normal">(optional)</span>
      </label>
      <ImageUploadGuide guide={guide} compact className="member-featured-image__guide" />
      <div className="member-featured-image__row">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="member-featured-image__preview" />
        ) : (
          <span className="member-featured-image__empty text-muted small">No image selected</span>
        )}
        <div className="member-featured-image__actions">
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="visually-hidden"
            disabled={uploading}
            onChange={(e) => onFileChange(e.target.files?.[0])}
          />
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value ? (
            <button
              type="button"
              className="btn btn-link btn-sm text-danger p-0"
              disabled={uploading}
              onClick={() => {
                onChange("");
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <p className="form-text mb-0">
        Choose a photo from your device. It is saved securely and used as your blog cover — you cannot browse the site
        media library.
      </p>
      {err ? <p className="text-danger small mb-0 mt-1">{err}</p> : null}
    </div>
  );
}
