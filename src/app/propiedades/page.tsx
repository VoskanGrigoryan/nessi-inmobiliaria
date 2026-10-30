import type { Metadata } from "next";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { PropertySearch } from "@/components/property-search";
import { getPaginatedProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Propiedades",
  description: "Explorá propiedades en venta y alquiler. Encontrá opciones según tus necesidades con el asesoramiento de Nessi Inmobiliaria.",
};

type SearchParams = Promise<{
  operation?: string;
  location?: string;
  type?: string;
  subtype?: string;
  rooms?: string;
  currency?: string;
  minimumPrice?: string;
  maximumPrice?: string;
  sort?: string;
  page?: string;
}>;

const pageSize = 9;

function parsePrice(value?: string) {
  if (!value?.trim()) return undefined;
  const price = Number(value.replace(/\./g, ""));
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

function paginationHref(page: number, filters: Awaited<SearchParams>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (key !== "page" && value) search.set(key, value);
  }
  search.set("page", String(page));
  return `/propiedades?${search.toString()}`;
}

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const requestedPage = Number(filters.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const roomsFilter = Number(filters.rooms);
  const minimumRooms = Number.isFinite(roomsFilter) ? roomsFilter || 0 : 0;
  const currency: "ARS" | "USD" | undefined =
    filters.currency === "ARS" ? "ARS" : filters.currency === "USD" ? "USD" : undefined;
  const minimumPrice = parsePrice(filters.minimumPrice);
  const maximumPrice = parsePrice(filters.maximumPrice);
  const invalidPriceRange = minimumPrice !== undefined && maximumPrice !== undefined && minimumPrice > maximumPrice;
  const sort: "newest" | "price_asc" | "price_desc" =
    filters.sort === "price_asc" || filters.sort === "price_desc" ? filters.sort : "newest";
  const hasPriceCriteria = Boolean(filters.minimumPrice?.trim() || filters.maximumPrice?.trim() || sort !== "newest");
  const missingCurrency = hasPriceCriteria && !currency;
  const propertyFilters = {
    operation: filters.operation,
    type: filters.type,
    subtype: filters.subtype,
    minimumRooms,
    location: filters.location,
    currency,
    minimumPrice: currency && !invalidPriceRange ? minimumPrice : undefined,
    maximumPrice: currency && !invalidPriceRange ? maximumPrice : undefined,
    sort: currency ? sort : "newest",
  };
  let results = await getPaginatedProperties(propertyFilters, page, pageSize);
  const totalPages = Math.ceil(results.total / pageSize);
  const currentPage = totalPages ? Math.min(page, totalPages) : 1;
  if (currentPage !== page) {
    results = await getPaginatedProperties(propertyFilters, currentPage, pageSize);
  }
  const { properties, total } = results;
  const firstVisiblePage = Math.max(1, currentPage - 2);
  const lastVisiblePage = Math.min(totalPages, currentPage + 2);
  const visiblePages = Array.from(
    { length: Math.max(0, lastVisiblePage - firstVisiblePage + 1) },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="sticky top-[65px] z-40 -mx-5 mb-5 bg-paper/95 px-5 py-2 backdrop-blur sm:-mx-8 sm:top-[77px] sm:px-8">
        <PropertySearch values={filters} compact />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3 border-b border-navy/10 pb-4">
        <div>
          <p className="mt-1 text-sm text-muted">
            {total} {total === 1 ? "propiedad encontrada" : "propiedades encontradas"}
          </p>
        </div>
        <p className="text-sm text-muted">Valores expresados según cada aviso.</p>
      </div>

      {(missingCurrency || invalidPriceRange) && (
        <p role="status" className="mt-4 text-sm text-amber-800">
          {invalidPriceRange
            ? "El precio mínimo debe ser menor o igual al máximo."
            : "Elegí una moneda para aplicar filtros u ordenar por precio."}
        </p>
      )}

      {properties.length ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <PropertyCard key={property.slug} property={property} eager={index === 0} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-navy/10 bg-white px-6 py-12 text-center">
          <h2 className="font-editorial text-2xl text-navy">
            No encontramos propiedades con esos filtros.
          </h2>
          <p className="mt-2 text-sm text-muted">
            Probá cambiar la ubicación o escribinos para que te ayudemos.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginación de propiedades" className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={paginationHref(Math.max(1, currentPage - 1), filters)}
            aria-disabled={currentPage === 1}
            className={`rounded-md border border-navy/15 px-3 py-2 text-sm font-medium text-navy hover:border-gold ${currentPage === 1 ? "pointer-events-none opacity-45" : ""}`}
          >
            Anterior
          </Link>
          {firstVisiblePage > 1 && (
            <>
              <Link href={paginationHref(1, filters)} className="rounded-md border border-navy/15 px-3 py-2 text-sm text-navy hover:border-gold">1</Link>
              {firstVisiblePage > 2 && <span aria-hidden="true" className="px-1 text-muted">…</span>}
            </>
          )}
          {visiblePages.map((pageNumber) => (
            <Link
              key={pageNumber}
              href={paginationHref(pageNumber, filters)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
              className={`rounded-md border px-3 py-2 text-sm ${pageNumber === currentPage ? "border-navy bg-navy font-semibold text-white" : "border-navy/15 text-navy hover:border-gold"}`}
            >
              {pageNumber}
            </Link>
          ))}
          {lastVisiblePage < totalPages && (
            <>
              {lastVisiblePage < totalPages - 1 && <span aria-hidden="true" className="px-1 text-muted">…</span>}
              <Link href={paginationHref(totalPages, filters)} className="rounded-md border border-navy/15 px-3 py-2 text-sm text-navy hover:border-gold">{totalPages}</Link>
            </>
          )}
          <Link
            href={paginationHref(Math.min(totalPages, currentPage + 1), filters)}
            aria-disabled={currentPage === totalPages}
            className={`rounded-md border border-navy/15 px-3 py-2 text-sm font-medium text-navy hover:border-gold ${currentPage === totalPages ? "pointer-events-none opacity-45" : ""}`}
          >
            Siguiente
          </Link>
        </nav>
      )}
    </main>
  );
}
