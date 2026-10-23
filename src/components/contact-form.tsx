"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";

type ContactFormProps = {
  title: string;
  neighborhood?: string;
  whatsappUrl: string;
  initialMessage?: string;
};

function getFieldError(name: string, value: string) {
  const cleanValue = value.trim();
  if (!cleanValue) {
    return name === "message" ? "Escribí un mensaje." : `Ingresá ${name === "name" ? "tu nombre" : name === "email" ? "tu email" : "tu teléfono"}.`;
  }
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
    return "Ingresá un email válido.";
  }
  if (name === "phone" && cleanValue.replace(/\D/g, "").length < 8) {
    return "Ingresá un teléfono válido con código de área.";
  }
  return "";
}

export function ContactForm({ title, neighborhood, whatsappUrl, initialMessage }: ContactFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateError(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    if (errors[name]) setErrors((current) => ({ ...current, [name]: getFieldError(name, value) }));
  }

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = ["name", "email", "phone", "message"];
    const nextErrors = Object.fromEntries(
      fields.map((field) => [field, getFieldError(field, String(form.get(field) ?? ""))])
        .filter(([, error]) => error),
    ) as Record<string, string>;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const phone = String(form.get("phone")).trim();
    const message = String(form.get("message")).trim();
    const inquiry = neighborhood ? `Hola, me interesa ${title} en ${neighborhood}.` : "Hola, quisiera recibir asesoramiento inmobiliario.";
    const body = `${inquiry}\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: +54 ${phone}\n\n${message}`;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;

    if (submitter?.value === "whatsapp") {
      const url = new URL(whatsappUrl);
      const whatsappBody = neighborhood ? `${body}\n\nEnlace: ${window.location.href}` : body;
      url.searchParams.set("text", whatsappBody);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    const subject = encodeURIComponent(`Consulta por ${title}`);
    window.location.href = `mailto:rosanacnessi@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  }

  const inputClassName = "h-12 min-w-0 rounded-lg border border-navy/50 px-3 text-sm text-navy outline-none placeholder:text-slate/70 focus:border-gold";
  const errorClassName = "mt-1 text-xs text-red-700";

  return (
    <form noValidate onSubmit={submitContact} className="mt-3 space-y-2">
      <div className="space-y-2">
        <div>
          <label className="sr-only" htmlFor="contact-name">Nombre</label>
          <input id="contact-name" name="name" placeholder="Nombre" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={updateError} className={`block w-full ${inputClassName} ${errors.name ? "border-red-700" : ""}`} />
          {errors.name && <p id="contact-name-error" className={errorClassName}>{errors.name}</p>}
        </div>
        <div>
          <label className="sr-only" htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="Email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={updateError} className={`block w-full ${inputClassName} ${errors.email ? "border-red-700" : ""}`} />
          {errors.email && <p id="contact-email-error" className={errorClassName}>{errors.email}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <span className="flex h-12 shrink-0 items-center gap-1 rounded-lg border border-navy/30 px-2 text-xs text-navy" aria-label="País: Argentina, código +54">
          <span aria-hidden="true">🇦🇷</span> +54
        </span>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="contact-phone">Teléfono</label>
          <input id="contact-phone" name="phone" type="tel" placeholder="Teléfono" autoComplete="tel-national" required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} onChange={updateError} className={`${inputClassName} w-full ${errors.phone ? "border-red-700" : ""}`} />
          {errors.phone && <p id="contact-phone-error" className={errorClassName}>{errors.phone}</p>}
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="contact-message">Mensaje</label>
        <textarea
          id="contact-message"
          name="message"
          defaultValue={initialMessage ?? (neighborhood ? `Quiero que se comuniquen conmigo por esta propiedad en ${neighborhood}.` : "")}
          required
          rows={3}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          onChange={updateError}
          className={`h-20 min-h-20 w-full resize-y rounded-lg border px-3 py-2 text-sm leading-5 text-navy outline-none focus:border-gold ${errors.message ? "border-red-700" : "border-navy/50"}`}
        />
        {errors.message && <p id="contact-message-error" className={errorClassName}>{errors.message}</p>}
      </div>
      <Button type="submit" variant="primary" name="contact-via" value="email" className="w-full rounded-lg px-4">
        Contactar <Icon name="mail" className="size-5 text-gold-light" />
      </Button>
      <Button type="submit" variant="custom" name="contact-via" value="whatsapp" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 text-sm font-bold text-white hover:bg-[#20bd5a] focus-visible:outline-navy">
        Contactar por WhatsApp <Icon name="whatsapp" className="size-5" />
      </Button>
    </form>
  );
}
