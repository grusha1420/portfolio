"use client";

import { useState } from "react";

import {
  ImageUploader,
  type ImageUploadValue,
} from "~/components/admin/ImageUploader";

export function UploadTestSection() {
  const [cover, setCover] = useState<string | ImageUploadValue>("");
  const [gallery, setGallery] = useState<(string | ImageUploadValue)[]>([]);
  const [heroGif, setHeroGif] = useState<string | ImageUploadValue>("");

  return (
    <section className="mt-8 flex flex-col gap-8 border-t border-border pt-8">
      <div>
        <h2 className="text-lg font-semibold">Upload test</h2>
        <p className="text-sm text-muted">
          ImageUploader demo — full admin forms in Tasks 23–26.
        </p>
      </div>

      <ImageUploader
        label="Cover image (single)"
        value={cover}
        onChange={setCover}
      />

      <ImageUploader
        label="Gallery images (multiple)"
        value={gallery}
        onChange={setGallery}
        multiple
      />

      <ImageUploader
        label="Hero GIF / wireframe layer"
        value={heroGif}
        onChange={setHeroGif}
        variant="hero"
      />
    </section>
  );
}
