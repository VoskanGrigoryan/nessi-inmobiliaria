import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Nosotros" };

const values = [
  {
    icon: "building",
    title: "Transparencia en cada operación",
    description: "Trabajamos con información clara, procesos definidos y una comunicación honesta para que nuestros clientes tomen decisiones con confianza.",
  },
  {
    icon: "home",
    title: "Acompañamiento personalizado",
    description: "Escuchamos tus objetivos y te acompañamos de cerca durante cada etapa de la compra, venta o alquiler.",
  },
  {
    icon: "compass",
    title: "Asesoramiento profesional",
    description: "Recibís orientación directa de una martillera pública matriculada para avanzar con claridad y seguridad.",
  },
] as const;

export default function AboutPage() {
  return (
    <main>
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">RN Negocios Inmobiliarios</p>
            <h1 className="mt-4 max-w-3xl font-editorial text-4xl leading-tight text-navy sm:text-6xl">
              Tu próxima decisión inmobiliaria, con claridad y respaldo.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate sm:text-lg">
              Somos una inmobiliaria cercana y profesional. Te ayudamos a encontrar, vender o alquilar una propiedad con atención personal y conocimiento del mercado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/propiedades" className="inline-flex h-12 items-center gap-2 bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-deep">
                Ver propiedades <Icon name="arrow" className="size-4" />
              </Link>
              <Link href="/contacto" className="inline-flex h-12 items-center border border-navy/20 px-5 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold">
                Contactanos
              </Link>
            </div>
          </div>
          <aside className="border-l-2 border-gold bg-navy p-7 text-white sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">Atención profesional</p>
            <p className="mt-4 font-editorial text-3xl">Rosana Nessi</p>
            <p className="mt-3 text-sm leading-6 text-white/75">Martillera Pública<br />Matrícula CUCICBA 9935</p>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Por qué elegirnos</p>
            <h2 className="mt-3 font-editorial text-3xl text-navy sm:text-4xl">Nuestra propuesta de valor</h2>
            <p className="mt-4 leading-7 text-slate">Un servicio claro y personal para que cada paso de tu operación esté bien acompañado.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="border border-navy/10 bg-paper p-6 sm:p-7">
                <Icon name={value.icon} className="size-7 text-gold" />
                <h3 className="mt-5 font-editorial text-xl text-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
