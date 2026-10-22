import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { Icon } from "@/components/icon";
import { ContactForm } from "@/components/contact-form";
import { PropertyGallery } from "@/components/property-gallery";
import { formatPrice, getPropertyBySlug, getWhatsAppUrl } from "@/lib/properties";
import { isAdminUser } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  return { title: property?.title ?? "Propiedad" };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const [property, isAdmin] = await Promise.all([getPropertyBySlug(slug), isAdminUser()]);
  if (!property) notFound();

  const whatsappUrl = getWhatsAppUrl(`Hola, me interesa la propiedad “${property.title}” en ${property.neighborhood}. ¿Podrían enviarme más información?`);

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-5 sm:py-12 lg:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <BackLink href="/propiedades" label="Volver a propiedades" />
        {isAdmin && property.id && (
          <Link href={`/admin/propiedades/${property.id}/editar`} className="inline-flex cursor-pointer items-center gap-2 border border-navy/15 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:border-gold hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
            <Icon name="edit" className="size-4" />Editar propiedad
          </Link>
        )}
      </div>

      {property.gallery.length
        ? <PropertyGallery images={property.gallery} title={property.title} />
        : <div className="grid min-h-72 place-items-center rounded-sm bg-sand text-gold"><Icon name="home" className="size-16" /></div>}

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-navy px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">
              {property.operation === "venta" ? "En venta" : "En alquiler"}
            </span>
            <span className="text-sm text-muted">{property.type} · {property.neighborhood}, {property.city}</span>
          </div>
          <h1 className="mt-4 font-editorial text-3xl leading-tight text-navy sm:text-4xl">{property.title}</h1>
          <p className="mt-4 text-2xl font-semibold text-navy">
            {formatPrice(property.price, property.currency)}
            {property.operation === "alquiler" && <span className="ml-2 text-sm font-normal text-muted">/ mes</span>}
          </p>
          {property.operation === "alquiler" && (
            <p className="mt-1 text-sm text-muted">
              Expensas: {property.expenses != null ? `${formatPrice(property.expenses, "ARS")} / mes` : "A confirmar"}
            </p>
          )}

          <div className="mt-7 border-y border-navy/10 py-5 text-sm text-slate">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              <div className="flex items-center gap-2"><Icon name="bed" className="size-5 text-gold" />{property.rooms} ambientes</div>
              <div className="flex items-center gap-2"><Icon name="bed" className="size-5 text-gold" />{property.bedrooms} dormitorios</div>
              <div className="flex items-center gap-2"><Icon name="bath" className="size-5 text-gold" />{property.bathrooms} baños</div>
              <div className="flex items-center gap-2"><Icon name="area" className="size-5 shrink-0 text-gold" />{property.area} m² totales</div>
              <div className="flex items-center gap-2"><Icon name="area" className="size-5 shrink-0 text-gold" />{property.coveredArea} m² cubiertos</div>
              {property.orientation && <div className="flex items-center gap-2"><Icon name="compass" className="size-5 shrink-0 text-gold" />Orientación: {property.orientation}</div>}
              {property.disposition && <div className="flex items-center gap-2"><Icon name="building" className="size-5 shrink-0 text-gold" />Disposición: {property.disposition}</div>}
              {property.hasGarage && <div className="flex items-center gap-2"><Icon name="garage" className="size-5 shrink-0 text-gold" />Cochera</div>}
            </div>
          </div>

          {property.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="font-editorial text-2xl text-navy">Amenities</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="border border-navy/10 bg-white px-3 py-2 text-sm text-slate">{amenity}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-8">
            <h2 className="font-editorial text-2xl text-navy">Sobre la propiedad</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate">{property.description}</p>
          </section>
        </div>

        <aside className="h-fit min-w-0 rounded-xl border border-navy/20 bg-white p-4">
          <h2 className="font-sans text-base font-bold text-navy">Contactanos</h2>
          <ContactForm
            title={property.title}
            neighborhood={property.neighborhood}
            whatsappUrl={whatsappUrl}
          />
        </aside>
      </div>
    </main>
  );
}
