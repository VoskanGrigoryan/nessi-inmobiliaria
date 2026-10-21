import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { PropertyCard } from "@/components/property-card";
import { PropertySearch } from "@/components/property-search";
import { Icon } from "@/components/icon";
import { getProperties } from "@/lib/properties";

const heroImage =
  "https://images.unsplash.com/photo-1665249934445-1de680641f50?auto=format&fit=crop&w=2200&q=90";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getProperties();
  const isDemo =
    (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) &&
    process.env.NODE_ENV !== "production";
  return (
    <main>
      <section className="relative isolate min-h-[540px] overflow-hidden bg-navy lg:min-h-[620px]">
        <Image
          src={heroImage}
          alt="Interior luminoso de un departamento"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/15" />
        <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-center px-6 py-20 sm:px-8 lg:min-h-[620px]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-light sm:text-sm">
              RN Negocios Inmobiliarios
            </p>
            <h1 className="mt-5 font-editorial text-4xl leading-[1.12] sm:text-6xl lg:text-7xl">
              Encontrá tu lugar en Buenos Aires.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Propiedades seleccionadas y asesoramiento personalizado para acompañarte en cada paso.
            </p>
            <Link
              href="/propiedades"
              className="mt-8 inline-flex items-center gap-3 border-b border-gold pb-2 text-sm font-semibold text-gold-light transition-colors hover:text-white">
              Explorar propiedades <Icon name="arrow" className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-5 sm:-mt-14 sm:px-8">
        <PropertySearch />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Una selección RN
            </p>
            <h2 className="mt-3 font-editorial text-3xl text-navy sm:text-4xl">
              Propiedades destacadas
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-deep hover:text-gold">
            Ver todas <Icon name="arrow" className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties
            .filter((property) => property.featured)
            .map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
        </div>
      </section>
    </main>
  );
}
