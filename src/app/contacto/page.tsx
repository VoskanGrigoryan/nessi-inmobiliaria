import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá a Nessi Inmobiliaria para recibir asesoramiento personalizado sobre compra, venta o alquiler de propiedades.",
};

export default function ContactPage() {
  return (
    <main className="bg-paper px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto grid max-w-7xl gap-8 border border-navy/10 bg-white p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contacto</p>
          <h1 className="mt-3 font-editorial text-3xl text-navy sm:text-4xl">Hablemos de tu pr&oacute;xima propiedad.</h1>
          <p className="mt-3 text-sm leading-6 text-slate">Dejanos tus datos y contanos c&oacute;mo podemos ayudarte.</p>
          <div className="mt-6 space-y-2 text-sm font-medium text-navy">
            <a className="block w-fit hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href="tel:+5491134823030">+54 9 11 3482 3030</a>
            <a className="block w-fit break-all hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href="mailto:rosanacnessi@gmail.com">rosanacnessi@gmail.com</a>
          </div>
        </div>
        <ContactForm
          title="asesoramiento inmobiliario"
          whatsappUrl={getWhatsAppUrl("Hola, quisiera recibir asesoramiento inmobiliario.")}
        />
      </section>
    </main>
  );
}
