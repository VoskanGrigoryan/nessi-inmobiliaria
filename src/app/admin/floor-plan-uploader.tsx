"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FloorPlan = { path: string; url: string; uploaded: boolean };
type ExistingFloorPlan = { path: string; url: string };
type InputFormat = "heic" | "jpeg" | "png" | "webp";

const maxFileSize = 20 * 1024 * 1024;

function getInputFormat(file: File): InputFormat | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "heic") return "heic";
  if (["jfif", "jpg", "jpeg"].includes(extension ?? "")) return "jpeg";
  if (extension === "png") return "png";
  if (extension === "webp") return "webp";
  return null;
}

export function FloorPlanUploader({ propertyId, plans: initialPlans, onUploadingChange }: {
  propertyId: string;
  plans: ExistingFloorPlan[];
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [plans, setPlans] = useState<FloorPlan[]>(() => initialPlans.map((plan) => ({ ...plan, uploaded: false })));
  const [uploading, setUploading] = useState(false);
  const [draggedPath, setDraggedPath] = useState("");
  const [removingPath, setRemovingPath] = useState("");
  const [error, setError] = useState("");
  const inputId = `property-floor-plans-${propertyId}`;

  async function uploadFiles(files: File[]) {
    if (!files.length || uploading || removingPath) return;

    for (const file of files) {
      if (!getInputFormat(file)) {
        setError("Formatos admitidos: HEIC, JFIF, JPG, JPEG, PNG y WebP.");
        return;
      }
      if (file.size > maxFileSize) {
        setError(`${file.name} supera el límite de 20 MB.`);
        return;
      }
    }

    setUploading(true);
    onUploadingChange(true);
    setError("");
    const additions: FloorPlan[] = [];
    try {
      const supabase = createSupabaseBrowserClient();
      for (const file of files) {
        const inputFormat = getInputFormat(file)!;
        let blob: Blob = file;
        let extension = inputFormat === "jpeg" ? "jpg" : inputFormat;
        let contentType = inputFormat === "jpeg" ? "image/jpeg" : `image/${inputFormat}`;

        if (inputFormat === "heic") {
          try {
            const { heicTo } = await import("heic-to");
            for (const quality of [0.9, 0.75, 0.6]) {
              blob = await heicTo({ blob: file, type: "image/jpeg", quality });
              if (blob.size <= maxFileSize) break;
            }
          } catch {
            setError(`No se pudo convertir ${file.name} a un formato compatible.`);
            break;
          }
          extension = "jpg";
          contentType = "image/jpeg";
        }

        if (blob.size > maxFileSize) {
          setError(`${file.name} supera el límite de 20 MB al prepararse para mostrarlo.`);
          break;
        }

        const path = `${propertyId}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("property-plans").upload(path, blob, {
          contentType,
          upsert: false,
        });
        if (uploadError) {
          setError(`No se pudo subir ${file.name}. Revisá tu conexión e intentá de nuevo.`);
          break;
        }

        additions.push({
          path,
          url: supabase.storage.from("property-plans").getPublicUrl(path).data.publicUrl,
          uploaded: true,
        });
      }
    } catch {
      setError("No se pudieron preparar los planos. Revisá los archivos e intentá de nuevo.");
    } finally {
      if (additions.length) setPlans((current) => [...current, ...additions]);
      setUploading(false);
      onUploadingChange(false);
    }
  }

  async function removePlan(plan: FloorPlan) {
    if (plan.uploaded) {
      setRemovingPath(plan.path);
      onUploadingChange(true);
      try {
        const { error: removeError } = await createSupabaseBrowserClient()
          .storage.from("property-plans").remove([plan.path]);
        if (removeError) {
          setError("No se pudo quitar ese plano. Intentá de nuevo.");
          return;
        }
      } catch {
        setError("No se pudo quitar ese plano. Intentá de nuevo.");
        return;
      } finally {
        setRemovingPath("");
        onUploadingChange(false);
      }
    }
    setPlans((current) => current.filter((item) => item.path !== plan.path));
  }

  function movePlan(from: number, to: number) {
    if (to < 0 || to >= plans.length) return;
    setPlans((current) => {
      const next = [...current];
      const [plan] = next.splice(from, 1);
      next.splice(to, 0, plan);
      return next;
    });
  }

  function reorderPlans(fromPath: string, toPath: string) {
    const from = plans.findIndex((plan) => plan.path === fromPath);
    const to = plans.findIndex((plan) => plan.path === toPath);
    if (from < 0 || to < 0 || from === to) return;
    movePlan(from, to);
  }

  return (
    <section className="space-y-3 border border-navy/10 bg-paper/60 p-4 sm:p-5" aria-labelledby="property-floor-plans-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="property-floor-plans-heading" className="text-sm font-semibold text-navy">Planos</h2>
        <span className="text-xs text-muted">{plans.length} {plans.length === 1 ? "plano" : "planos"}</span>
      </div>
      <p className="text-xs leading-5 text-slate">Subí planos como contenido separado de las fotos. Arrastrá para cargarlos y reordená la lista con el mouse o las flechas.</p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (event.dataTransfer.files.length) void uploadFiles(Array.from(event.dataTransfer.files));
        }}
        className="grid min-h-32 place-items-center border border-dashed border-navy/25 bg-white px-4 py-5 text-center"
      >
        <div className="space-y-2">
          <Icon name="upload" className="mx-auto size-5 text-gold" />
          <p className="text-xs text-slate">Arrastrá archivos acá o elegilos desde tu dispositivo.</p>
          <label htmlFor={inputId} className="inline-flex h-9 cursor-pointer items-center border border-navy/20 px-3 text-xs font-medium text-navy hover:border-gold hover:text-gold">
            Seleccionar planos
            <input
              id={inputId}
              type="file"
              multiple
              accept=".heic,.jfif,.jpg,.jpeg,.png,.webp,image/heic,image/heif,image/jfif,image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files ?? []);
                event.currentTarget.value = "";
                void uploadFiles(files);
              }}
              disabled={uploading || Boolean(removingPath)}
              className="sr-only"
            />
          </label>
          <p className="text-[11px] text-muted">HEIC, JFIF, JPG, JPEG, PNG o WebP · hasta 20 MB por archivo.</p>
        </div>
      </div>

      {uploading && <p role="status" className="inline-flex items-center gap-2 text-xs text-muted"><Icon name="refresh" className="size-4 animate-spin" />Procesando planos…</p>}
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}

      <div role="list" aria-label="Planos en el orden de publicación" className="flex flex-wrap gap-2">
        {plans.map((plan, index) => (
          <div
            key={plan.path}
            role="listitem"
            draggable={plans.length > 1 && !uploading && !removingPath}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", plan.path);
              setDraggedPath(plan.path);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              reorderPlans(event.dataTransfer.getData("text/plain") || draggedPath, plan.path);
              setDraggedPath("");
            }}
            onDragEnd={() => setDraggedPath("")}
            className={`inline-flex min-h-10 items-center gap-1 rounded-full border bg-white py-1 pl-2 pr-1 text-xs text-navy ${draggedPath === plan.path ? "opacity-40" : "border-navy/15"}`}
          >
            <span aria-hidden="true" className="cursor-grab text-muted active:cursor-grabbing"><Icon name="drag" className="size-4" /></span>
            <Image src={plan.url} alt="" width={36} height={28} unoptimized className="size-7 rounded-sm object-cover" />
            <span className="px-1">Plano {index + 1}</span>
            <input type="hidden" name="floor_plan_order" value={plan.path} />
            {plan.uploaded && <input type="hidden" name="uploaded_floor_plans" value={plan.path} />}
            <Button variant="custom" type="button" onClick={() => movePlan(index, index - 1)} disabled={uploading || Boolean(removingPath) || index === 0} aria-label={`Mover plano ${index + 1} antes`} className="grid size-7 place-items-center rounded-full text-slate hover:bg-paper disabled:cursor-default disabled:opacity-30">↑</Button>
            <Button variant="custom" type="button" onClick={() => movePlan(index, index + 1)} disabled={uploading || Boolean(removingPath) || index === plans.length - 1} aria-label={`Mover plano ${index + 1} después`} className="grid size-7 place-items-center rounded-full text-slate hover:bg-paper disabled:cursor-default disabled:opacity-30">↓</Button>
            <Button variant="custom" type="button" onClick={() => void removePlan(plan)} disabled={uploading || Boolean(removingPath)} aria-label={`Quitar plano ${index + 1}`} className="grid size-7 place-items-center rounded-full text-slate hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-50">
              <Icon name={removingPath === plan.path ? "refresh" : "close"} className={`size-4 ${removingPath === plan.path ? "animate-spin" : ""}`} />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
