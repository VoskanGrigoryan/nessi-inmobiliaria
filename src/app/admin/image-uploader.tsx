"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PropertyImage = { path: string; url: string; uploaded: boolean };
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

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("No se pudo preparar la imagen.")), "image/webp", 0.82);
  });
}

export function ImageUploader({ propertyId, images: initialImages, onUploadingChange }: {
  propertyId: string;
  images: ExistingImage[];
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [images, setImages] = useState<PropertyImage[]>(() => initialImages.map((image) => ({ ...image, uploaded: false })));
  const [uploading, setUploading] = useState(false);
  const [draggedPath, setDraggedPath] = useState("");
  const [error, setError] = useState("");
  const [removingPath, setRemovingPath] = useState("");
  const inputId = `property-images-${propertyId}`;

  async function uploadFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (!files.length) return;

    if (images.length + files.length > 20) {
      setError("Una propiedad puede tener hasta 20 fotos.");
      return;
    }
    if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024)) {
      setError("Usá fotos JPG, PNG o WebP de hasta 8 MB cada una.");
      return;
    }

    setUploading(true);
    onUploadingChange(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
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
        const url = supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl;
        setImages((current) => [...current, { path, url, uploaded: true }]);
      }
    } catch {
      setError("No se pudieron preparar las fotos. Revisá los archivos e intentá de nuevo.");
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  }

  async function removeImage(image: PropertyImage) {
    if (image.uploaded) {
      setRemovingPath(image.path);
      try {
        const { error: removeError } = await createSupabaseBrowserClient()
          .storage.from("property-images").remove([image.path]);
        if (removeError) {
          setError("No se pudo quitar esa foto. Intentá de nuevo.");
          return;
        }
      } catch {
        setError("No se pudo quitar esa foto. Intentá de nuevo.");
        return;
      } finally {
        setRemovingPath("");
      }
    }
    setImages((current) => current.filter((item) => item.path !== image.path));
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    setImages((current) => {
      const next = [...current];
      const [image] = next.splice(from, 1);
      next.splice(to, 0, image);
      return next;
    });
  }

  function reorderImages(fromPath: string, toPath: string) {
    const from = images.findIndex((image) => image.path === fromPath);
    const to = images.findIndex((image) => image.path === toPath);
    if (from < 0 || to < 0 || from === to) return;
    moveImage(from, to);
  }

  return (
    <section className="space-y-3 border border-navy/10 bg-paper/60 p-4 sm:p-5" aria-labelledby="property-images-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="property-images-heading" className="text-sm font-semibold text-navy">Fotos de la propiedad</h2>
        <span className="text-xs text-muted">{images.length} / 20</span>
      </div>
      <p className="text-xs leading-5 text-slate">La primera foto será la principal. Arrastrá para ordenarlas o usá las flechas.</p>

      <label htmlFor={inputId} className="inline-flex h-10 cursor-pointer items-center gap-2 border border-navy/20 bg-white px-4 text-sm font-medium text-navy transition-colors hover:border-gold hover:text-gold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold">
        <Icon name="upload" className="size-4" />
        Seleccionar fotos
        <input id={inputId} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={uploadFiles} disabled={uploading} className="sr-only" />
      </label>
      <p className="text-xs text-muted">JPG, PNG o WebP; hasta 8 MB por foto.</p>

      {uploading && <p role="status" className="inline-flex items-center gap-2 text-xs text-muted"><Icon name="refresh" className="size-4 animate-spin" />Subiendo fotos…</p>}
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}

      <div role="list" aria-label="Fotos en el orden de publicación" className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div
            key={image.path}
            role="listitem"
            draggable={images.length > 1}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", image.path);
              setDraggedPath(image.path);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              reorderImages(event.dataTransfer.getData("text/plain") || draggedPath, image.path);
              setDraggedPath("");
            }}
            onDragEnd={() => setDraggedPath("")}
            className={`inline-flex min-h-10 items-center gap-1 rounded-full border bg-white py-1 pl-2 pr-1 text-xs text-navy ${draggedPath === image.path ? "opacity-40" : "border-navy/15"}`}
          >
            <span aria-hidden="true" className="cursor-grab text-muted active:cursor-grabbing"><Icon name="drag" className="size-4" /></span>
            <Image src={image.url} alt="" width={28} height={28} unoptimized className="size-7 rounded-full object-cover" />
            <span className="px-1">Foto {index + 1}{index === 0 ? " · principal" : ""}</span>
            <input type="hidden" name="image_order" value={image.path} />
            {image.uploaded && <input type="hidden" name="uploaded_images" value={image.path} />}
            <Button variant="custom" type="button" onClick={() => moveImage(index, index - 1)} disabled={index === 0} aria-label={`Mover foto ${index + 1} antes`} className="grid size-7 place-items-center rounded-full text-slate hover:bg-paper disabled:cursor-default disabled:opacity-30">↑</Button>
            <Button variant="custom" type="button" onClick={() => moveImage(index, index + 1)} disabled={index === images.length - 1} aria-label={`Mover foto ${index + 1} después`} className="grid size-7 place-items-center rounded-full text-slate hover:bg-paper disabled:cursor-default disabled:opacity-30">↓</Button>
            <Button variant="custom" type="button" onClick={() => void removeImage(image)} disabled={uploading || Boolean(removingPath)} aria-label={`${removingPath === image.path ? "Quitando" : "Quitar"} foto ${index + 1}`} className="grid size-7 place-items-center rounded-full text-slate hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-50">
              <Icon name={removingPath === image.path ? "refresh" : "close"} className={`size-4 ${removingPath === image.path ? "animate-spin" : ""}`} />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
