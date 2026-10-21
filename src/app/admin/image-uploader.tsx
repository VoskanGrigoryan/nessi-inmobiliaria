"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ExistingImage = { path: string; url: string };

async function optimizeImage(file: File) {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    image.close();
    throw new Error("No se pudo preparar la imagen.");
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("No se pudo preparar la imagen.")), "image/webp", 0.82);
  });
  return blob;
}

export function ImageUploader({ propertyId, images, onUploadingChange }: {
  propertyId: string;
  images: ExistingImage[];
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (!files.length) return;

    if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024)) {
      setError("Usá fotos JPG, PNG o WebP de hasta 8 MB cada una.");
      return;
    }

    setUploading(true);
    onUploadingChange(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    try {
      for (const file of files) {
        const image = await optimizeImage(file);
        const path = `${propertyId}/${crypto.randomUUID()}.webp`;
        const { error: uploadError } = await supabase.storage.from("property-images").upload(path, image, {
          contentType: "image/webp",
          upsert: false,
        });
        if (uploadError) {
          setError("No se pudo subir una foto. Revisá tu conexión e intentá de nuevo.");
          break;
        }
        setUploaded((current) => [...current, path]);
      }
    } catch {
      setError("No se pudieron preparar las fotos. Revisa los archivos e intenta de nuevo.");
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  }

  async function removeUploaded(path: string) {
    const { error: removeError } = await createSupabaseBrowserClient()
      .storage.from("property-images").remove([path]);
    if (removeError) setError("No se pudo quitar esa foto. Intentá de nuevo.");
    else setUploaded((current) => current.filter((item) => item !== path));
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate">Agregar fotos
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={uploadFiles} disabled={uploading} className="mt-2 block w-full text-sm" />
        <span className="mt-1 block font-normal text-muted">JPG, PNG o WebP; máximo 8 MB cada una.</span>
      </label>
      {uploading && <p className="text-xs text-muted">Subiendo fotos…</p>}
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      {images.map(({ path, url }, index) => (
        <label key={path} className="flex items-center gap-2 text-sm text-slate">
          <input type="checkbox" name="remove_images" value={path} />
          <a href={url} target="_blank" rel="noreferrer" className="underline">Ver foto {index + 1}</a>
          <span>Eliminar</span>
        </label>
      ))}
      {uploaded.map((path) => (
        <div key={path} className="flex items-center gap-2 text-sm text-slate">
          <input type="hidden" name="uploaded_images" value={path} />
          <span>Foto nueva lista</span>
          <button type="button" onClick={() => removeUploaded(path)} className="underline">Quitar</button>
        </div>
      ))}
    </div>
  );
}
