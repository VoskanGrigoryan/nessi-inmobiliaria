import type { Metadata } from "next";
import Image from "next/image";
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
    description: "Escuchamos tus objetivos y te acompañamos de cerca durante cada etapa de la compra, venta, alquiler o alquiler temporal.",
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
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-4xl">
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
          <div className="mt-8 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-gold bg-navy px-5 py-3 text-white">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">Martillera P&uacute;blica</span>
            <span aria-hidden="true" className="text-gold-light">&middot;</span>
            <span className="text-sm font-semibold">Matr&iacute;cula CUCICBA 9935</span>
          </div>
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

      <section className="bg-paper px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="thanks-heading">
        <div className="relative mx-auto grid max-w-7xl overflow-hidden border-y-4 border-gold bg-navy text-white md:grid-cols-2">
          <div className="relative min-h-[24rem]">
            <Image src="/contact-reference-left.jpg" alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-navy/35" />
            <div className="relative flex min-h-[24rem] flex-col justify-center p-7 sm:p-10 lg:p-12">
              <h2 id="thanks-heading" className="font-editorial text-4xl leading-tight text-white sm:text-5xl">Muchas gracias</h2>
              <div className="mt-8 grid gap-6 border-t border-white/15 pt-6 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Contacto</p>
                  <div className="mt-4 space-y-2 text-sm sm:text-base">
                    <a className="block w-fit hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light" href="tel:+5491134823030">+54 9 11 3482 3030</a>
                    <a className="block w-fit break-all hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light" href="mailto:rosanacnessi@gmail.com">rosanacnessi@gmail.com</a>
                  </div>
                </div>
                <Image
                  src="/rosana-nessi-logo.png"
                  alt="Rosana Nessi Negocios Inmobiliarios"
                  width={433}
                  height={408}
                  className="h-40 w-40 justify-self-center object-contain lg:h-48 lg:w-48 lg:justify-self-end"
                />
              </div>
            </div>
          </div>

          <div className="relative min-h-[24rem]">
            <Image src="/contact-reference-right.jpg" alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-navy/60" />
            <div className="relative flex min-h-[24rem] items-center p-7 sm:p-10 lg:p-14">
              <p className="max-w-lg text-base leading-8 text-white sm:text-lg">
                En RN Negocios Inmobiliarios creemos que vender o comprar una propiedad es mucho m&aacute;s que una transacci&oacute;n. Por eso ofrecemos un servicio basado en la confianza, la transparencia, el asesoramiento profesional y el compromiso permanente con nuestros clientes, acompa&ntilde;&aacute;ndolos en cada paso del proceso hasta alcanzar sus objetivos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
