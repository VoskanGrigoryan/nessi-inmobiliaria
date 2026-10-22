import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { formatPrice, type PropertyCardData } from "@/lib/properties";

export function PropertyCard({ property, eager = false }: { property: PropertyCardData; eager?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-sm border border-navy/10 bg-white transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(1,22,51,0.12)] focus-within:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0">
      <Link href={`/propiedades/${property.slug}`} className="block">
        <div className="relative aspect-[1.55] overflow-hidden bg-sand">
          {property.image ? (
            <Image
              src={property.image}
              alt={property.title}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03] group-focus-within:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100"
            />
          ) : (
            <div className="grid h-full place-items-center text-gold"><Icon name="home" className="size-12" /></div>
          )}
          <span className="absolute left-3 top-3 bg-navy px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">
            {property.operation === "venta" ? "En venta" : "En alquiler"}
          </span>
        </div>
        <div className="p-5">
          <p className="flex items-center gap-1.5 text-xs text-slate">
            <Icon name="pin" className="size-3.5 text-gold" />
            {property.neighborhood}, {property.city}
          </p>
          <h3 className="mt-2 min-h-14 font-editorial text-xl leading-7 text-navy group-hover:text-blue-deep">
            {property.title}
          </h3>
          <p className="mt-3 text-lg font-semibold text-navy">
            {formatPrice(property.price, property.currency)}
            {property.operation === "alquiler" && <span className="ml-1 text-xs font-normal text-slate">/ mes</span>}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-navy/10 pt-4 text-xs text-slate">
            <span className="inline-flex items-center gap-1.5"><Icon name="bed" className="size-4 text-gold" />{property.rooms} amb.</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="bath" className="size-4 text-gold" />{property.bathrooms} baños</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="area" className="size-4 text-gold" />{property.area} m²</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
