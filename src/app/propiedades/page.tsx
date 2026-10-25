import type { Metadata } from "next";
import { PropertyCard } from "@/components/property-card";
import { PropertySearch } from "@/components/property-search";
import { getProperties } from "@/lib/properties";

export const metadata: Metadata = { title: "Propiedades" };

type SearchParams = Promise<{
  operation?: string;
  location?: string;
  type?: string;
  subtype?: string;
  rooms?: string;
}>;

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const roomsFilter = Number(filters.rooms);
  const minimumRooms = Number.isFinite(roomsFilter) ? roomsFilter || 0 : 0;
  const properties = await getProperties({
    operation: filters.operation,
    type: filters.type,
    subtype: filters.subtype,
    minimumRooms,
    location: filters.location,
  });

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="lg:sticky lg:top-3 lg:z-30 lg:mb-5">
        <PropertySearch values={filters} compact />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3 border-b border-navy/10 pb-4">
        <div>
          <p className="mt-1 text-sm text-muted">
            {properties.length} propiedades encontradas
          </p>
        </div>
        <p className="text-sm text-muted">Valores expresados según cada aviso.</p>
      </div>

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
    </main>
  );
}
