"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import type { Property } from "@/lib/properties";
import { ImageUploader } from "@/app/admin/image-uploader";
import { Icon } from "@/components/icon";
import { isPropertyCity, isPropertyLocation, propertyLocations, type PropertyCity } from "@/lib/property-locations";
import { propertyAmenities } from "@/lib/property-amenities";

function formatThousands(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function PropertyFormActions({ uploading, property }: { uploading: boolean; property?: Property }) {
  const { pending } = useFormStatus();
  const busy = uploading || pending;
  const iconName = busy ? "refresh" : property ? "check" : "home";
  const buttonLabel = uploading
    ? "Subiendo fotos…"
    : pending
      ? (property ? "Guardando cambios…" : "Creando propiedad…")
      : (property ? "Guardar cambios" : "Crear propiedad");

  return (
    <div className="flex flex-wrap justify-end gap-3 border-t border-navy/10 pt-6">
      <Link
        href="/admin"
        aria-disabled={busy}
        onClick={(event) => { if (busy) event.preventDefault(); }}
        className={`inline-flex h-12 items-center gap-2 border border-navy/20 px-5 text-sm font-semibold text-navy transition-colors hover:border-gold hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${busy ? "cursor-wait opacity-60" : "cursor-pointer"}`}
      >
        <Icon name="close" className="size-4" />Cancelar
      </Link>
      <button type="submit" disabled={busy} aria-busy={busy} className="inline-flex h-12 cursor-pointer items-center gap-2 bg-navy px-6 text-sm font-semibold text-white enabled:hover:bg-blue-deep disabled:cursor-wait disabled:opacity-60">
        <Icon name={iconName} className={`size-4 ${busy ? "animate-spin" : ""}`} />
        {buttonLabel}
      </button>
    </div>
  );
}

export function PropertyForm({ property, propertyId, isNew = false, action }: {
  property?: Property;
  propertyId: string;
  isNew?: boolean;
  action: (formData: FormData) => Promise<void>;
}) {
  const cityValue = property?.city ?? "";
  const initialCity: PropertyCity = isPropertyCity(cityValue) ? cityValue : "CABA";
  const [city, setCity] = useState<PropertyCity>(initialCity);
  const [neighborhood, setNeighborhood] = useState(
    isPropertyLocation(initialCity, property?.neighborhood ?? "") ? property?.neighborhood ?? "" : "",
  );
  const [price, setPrice] = useState(property ? String(Math.round(property.price)) : "");
  const [uploading, setUploading] = useState(false);
  const input = "mt-1 h-11 w-full border border-navy/15 bg-white px-3 text-sm text-navy outline-none focus:border-gold";
  const label = "block text-xs font-medium text-slate";
  const locations = [...propertyLocations[city]].sort((left, right) => left.localeCompare(right, "es-AR"));

  return (
    <form action={action} className="space-y-7">
      <input type="hidden" name="id" value={propertyId} />
      <input type="hidden" name="is_new" value={String(isNew)} />
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-navy">Información básica</h2>
          <p className="mt-1 text-xs text-muted">Título, operación y ubicación de la propiedad.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className={`${label} sm:col-span-2 xl:col-span-3`}>Título
            <input required name="title" defaultValue={property?.title} className={input} />
          </label>
          <div className={label}>
            <div className="flex items-center gap-1">
              <label htmlFor="property-slug">URL del aviso</label>
              <span className="group relative inline-flex">
                <button type="button" aria-label="Ayuda sobre la URL del aviso" aria-describedby="slug-help" className="cursor-help text-muted hover:text-gold focus-visible:outline-2 focus-visible:outline-gold">
                  <Icon name="info" className="size-4" />
                </button>
                <span id="slug-help" role="tooltip" className="pointer-events-none absolute left-5 top-0 z-20 w-64 rounded-sm bg-navy px-3 py-2 text-xs font-normal leading-5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  No es obligatorio. Si lo dejás vacío, se genera automáticamente a partir del título.
                </span>
              </span>
            </div>
            <input id="property-slug" name="slug" defaultValue={property?.slug} placeholder="Se genera desde el título" className={input} />
          </div>
          <label className={label}>Operación
            <select name="operation" defaultValue={property?.operation ?? "venta"} className={input}>
              <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
            </select>
          </label>
          <label className={label}>Tipo
            <select name="property_type" defaultValue={property?.type ?? "Departamento"} className={input}>
              <option>Departamento</option><option>Casa</option><option>PH</option><option>Otro</option>
            </select>
          </label>
          <label className={label}>Ciudad
            <select name="city" value={city} onChange={(event) => {
              setCity(event.target.value as PropertyCity);
              setNeighborhood("");
            }} className={input}>
              {Object.keys(propertyLocations).map((location) => <option key={location}>{location}</option>)}
            </select>
          </label>
          <label className={label}>Barrio / localidad
            <select required name="neighborhood" value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} className={input}>
              <option value="">Seleccioná una opción</option>
              {locations.map((location) => <option key={location}>{location}</option>)}
            </select>
          </label>
          <label className={label}>Calle
            <input required maxLength={150} name="street" defaultValue={property?.street ?? ""} className={input} />
          </label>
          <label className={label}>Número
            <input required maxLength={30} name="street_number" defaultValue={property?.streetNumber ?? ""} className={input} />
          </label>
          <label className={label}>Piso (opcional)
            <input maxLength={30} name="floor" defaultValue={property?.floor ?? ""} className={input} />
          </label>
          <label className={label}>Departamento (opcional)
            <input maxLength={30} name="apartment" defaultValue={property?.apartment ?? ""} className={input} />
          </label>
        </div>
      </section>

      <section className="space-y-4 border-t border-navy/10 pt-6">
        <div>
          <h2 className="font-semibold text-navy">Precio y gastos</h2>
          <p className="mt-1 text-xs text-muted">Precio de publicación y expensas mensuales, si corresponde.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className={label}>Precio
            <input type="hidden" name="price" value={price} />
            <input required type="text" inputMode="numeric" value={formatThousands(price)} onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))} placeholder="Ej.: 1.000.000" className={input} />
          </label>
          <label className={label}>Moneda
            <select name="currency" defaultValue={property?.currency ?? "USD"} className={input}>
              <option>USD</option><option>ARS</option>
            </select>
          </label>
          <label className={label}>Expensas (ARS / mes, opcional)
            <input type="number" min="0" step="any" name="expenses" defaultValue={property?.expenses ?? ""} className={input} />
          </label>
        </div>
      </section>

      <section className="space-y-4 border-t border-navy/10 pt-6">
        <div>
          <h2 className="font-semibold text-navy">Características</h2>
          <p className="mt-1 text-xs text-muted">Ambientes, superficies y otros detalles de la propiedad.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className={label}>Ambientes<input required type="number" min="0" name="rooms" defaultValue={property?.rooms ?? 0} className={input} /></label>
          <label className={label}>Dormitorios<input required type="number" min="0" name="bedrooms" defaultValue={property?.bedrooms ?? 0} className={input} /></label>
          <label className={label}>Baños<input required type="number" min="0" name="bathrooms" defaultValue={property?.bathrooms ?? 0} className={input} /></label>
          <label className={label}>Superficie total (m²)<input required type="number" min="0" name="area" defaultValue={property?.area ?? 0} className={input} /></label>
          <label className={label}>Superficie cubierta (m²)<input required type="number" min="0" name="covered_area" defaultValue={property?.coveredArea ?? 0} className={input} /></label>
          <label className={label}>Cochera
            <select name="has_garage" defaultValue={property?.hasGarage ? "true" : "false"} className={input}>
              <option value="false">No tiene</option><option value="true">Tiene</option>
            </select>
          </label>
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
        </div>
      </section>

      <section className="space-y-4 border-t border-navy/10 pt-6">
        <div>
          <h2 className="font-semibold text-navy">Amenities</h2>
          <p className="mt-1 text-xs text-muted">Seleccioná los servicios y espacios que ofrece la propiedad.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          {propertyAmenities.map((amenity) => (
            <label key={amenity} className="flex cursor-pointer items-center gap-2 border border-navy/10 bg-white px-3 py-2 text-sm text-slate hover:border-gold">
              <input type="checkbox" name="amenities" value={amenity} defaultChecked={property?.amenities?.includes(amenity)} />
              {amenity}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4 border-t border-navy/10 pt-6">
        <div>
          <h2 className="font-semibold text-navy">Descripción y fotos</h2>
          <p className="mt-1 text-xs text-muted">Contá más sobre la propiedad y ordená las imágenes para su publicación.</p>
        </div>
        <label className={label}>Descripción
          <textarea name="description" rows={5} defaultValue={property?.description} className="mt-1 w-full border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-gold" />
        </label>
        <ImageUploader propertyId={propertyId} onUploadingChange={setUploading} images={(property?.gallery ?? []).map((url, index) => ({
          url,
          path: property?.imagePaths?.[index] ?? "",
        }))} />
      </section>

      <section className="space-y-4 border-t border-navy/10 pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-semibold text-navy">Publicación</h2>
            <p className="mt-1 text-xs text-muted">Elegí si aparece en el inicio y su estado.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm text-slate">
              <input type="checkbox" name="featured" defaultChecked={property?.featured} /> Destacar en el inicio
            </label>
            <label className="flex items-center gap-3 text-xs font-medium text-slate">Estado
              <select name="status" defaultValue={property?.status ?? "draft"} className="h-10 border border-navy/15 bg-white px-3 text-sm text-navy">
                <option value="draft">Borrador</option><option value="published">Publicado</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <PropertyFormActions uploading={uploading} property={property} />
    </form>
  );
}
