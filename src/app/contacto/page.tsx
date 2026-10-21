import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getWhatsAppUrl } from "@/lib/properties";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-paper px-5 py-12 sm:py-16">
      <section className="w-full max-w-xl rounded-xl border border-navy/15 bg-white p-5 sm:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contacto</p>
        <h1 className="mt-3 text-center font-editorial text-3xl text-navy sm:text-4xl">Hablemos de tu próxima propiedad.</h1>
        <p className="mt-3 text-center text-sm leading-6 text-slate">Dejanos tus datos y contanos cómo podemos ayudarte.</p>
        <ContactForm
          title="asesoramiento inmobiliario"
          whatsappUrl={getWhatsAppUrl("Hola, quisiera recibir asesoramiento inmobiliario.")}
        />
      </section>
    </main>
  );
}
