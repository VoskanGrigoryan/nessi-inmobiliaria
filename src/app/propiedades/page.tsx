import type { Metadata } from "next";
import { PropertyCard } from "@/components/property-card";
import { PropertySearch } from "@/components/property-search";
import { getProperties } from "@/lib/properties";

export const metadata: Metadata = { title: "Propiedades" };

type SearchParams = Promise<{
  operation?: string;
  location?: string;
  type?: string;
  rooms?: string;
}>;

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const properties = await getProperties();
  const location = filters.location?.trim().toLocaleLowerCase("es-AR");
  const minimumRooms = Number(filters.rooms) || 0;
  const filteredProperties = properties.filter((property) => {
    const propertyLocation = `${property.neighborhood} ${property.city}`.toLocaleLowerCase("es-AR");
    return (
      (!filters.operation || property.operation === filters.operation) &&
      (!filters.type || property.type === filters.type) &&
      (!location || propertyLocation.includes(location)) &&
      property.rooms >= minimumRooms
    );
  });

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="lg:sticky lg:top-3 lg:z-30 lg:mb-5">
        <PropertySearch values={filters} compact />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3 border-b border-navy/10 pb-4">
        <div>
          <p className="mt-1 text-sm text-muted">
            {filteredProperties.length} propiedades encontradas
          </p>
        </div>
        <p className="text-sm text-muted">Valores expresados según cada aviso.</p>
      </div>

      {filteredProperties.length ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.slug} property={property} />
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
