"use client";

import { useState } from "react";
import type { Property } from "@/lib/properties";
import { ImageUploader } from "@/app/admin/image-uploader";

export function PropertyForm({ property, propertyId, isNew = false, action }: {
  property?: Property;
  propertyId: string;
  isNew?: boolean;
  action: (formData: FormData) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const input = "mt-1 h-11 w-full border border-navy/15 bg-white px-3 text-sm text-navy outline-none focus:border-gold";
  const label = "block text-xs font-medium text-slate";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={propertyId} />
      <input type="hidden" name="is_new" value={String(isNew)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>Título
          <input required name="title" defaultValue={property?.title} className={input} />
        </label>
        <label className={label}>URL del aviso
          <input name="slug" defaultValue={property?.slug} placeholder="Se genera desde el título" className={input} />
        </label>
        <label className={label}>Operación
          <select name="operation" defaultValue={property?.operation ?? "venta"} className={input}>
            <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
          </select>
        </label>
        <label className={label}>Tipo
          <select name="property_type" defaultValue={property?.type ?? "Departamento"} className={input}>
            <option>Departamento</option><option>Casa</option><option>PH</option>
          </select>
        </label>
        <label className={label}>Barrio / localidad
          <input required name="neighborhood" defaultValue={property?.neighborhood} className={input} />
        </label>
        <label className={label}>Ciudad
          <input required name="city" defaultValue={property?.city ?? "CABA"} className={input} />
        </label>
        <label className={label}>Precio
          <input required type="number" min="0" step="any" name="price" defaultValue={property?.price} className={input} />
        </label>
        <label className={label}>Moneda
          <select name="currency" defaultValue={property?.currency ?? "USD"} className={input}>
            <option>USD</option><option>ARS</option>
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>Expensas (ARS / mes, opcional)
          <input type="number" min="0" step="any" name="expenses" defaultValue={property?.expenses ?? ""} className={input} />
        </label>
        <label className={label}>Ambientes<input required type="number" min="0" name="rooms" defaultValue={property?.rooms ?? 0} className={input} /></label>
        <label className={label}>Dormitorios<input required type="number" min="0" name="bedrooms" defaultValue={property?.bedrooms ?? 0} className={input} /></label>
        <label className={label}>Baños<input required type="number" min="0" name="bathrooms" defaultValue={property?.bathrooms ?? 0} className={input} /></label>
        <label className={label}>Superficie total (m²)<input required type="number" min="0" name="area" defaultValue={property?.area ?? 0} className={input} /></label>
        <label className={label}>Superficie cubierta (m²)<input required type="number" min="0" name="covered_area" defaultValue={property?.coveredArea ?? 0} className={input} /></label>
        <label className={label}>Orientación (opcional)
          <select name="orientation" defaultValue={property?.orientation ?? ""} className={input}>
            <option value="">Sin especificar</option>
            <option>Norte</option><option>Noreste</option><option>Este</option><option>Sudeste</option>
            <option>Sur</option><option>Sudoeste</option><option>Oeste</option><option>Noroeste</option>
          </select>
        </label>
        <label className={label}>Disposición (opcional)
          <select name="disposition" defaultValue={property?.disposition ?? ""} className={input}>
            <option value="">Sin especificar</option><option>Frente</option><option>Contrafrente</option>
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>Descripción
          <textarea name="description" rows={5} defaultValue={property?.description} className="mt-1 w-full border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-gold" />
        </label>
      </div>

      <ImageUploader propertyId={propertyId} onUploadingChange={setUploading} images={(property?.gallery ?? []).map((url, index) => ({
        url,
        path: property?.imagePaths?.[index] ?? "",
      }))} />

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-slate">
          <input type="checkbox" name="featured" defaultChecked={property?.featured} /> Destacar en el inicio
        </label>
        <label className={`${label} flex items-center gap-3`}>Estado
          <select name="status" defaultValue={property?.status ?? "draft"} className="h-10 border border-navy/15 bg-white px-3 text-sm text-navy">
            <option value="draft">Borrador</option><option value="published">Publicado</option>
          </select>
        </label>
      </div>

      <button disabled={uploading} className="h-12 bg-navy px-6 text-sm font-semibold text-white enabled:hover:bg-blue-deep disabled:cursor-wait disabled:opacity-60">
        {uploading ? "Subiendo fotos…" : property ? "Guardar cambios" : "Crear propiedad"}
      </button>
    </form>
  );
}
