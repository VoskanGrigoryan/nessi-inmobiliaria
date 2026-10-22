"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloat({ property }: { property?: { title: string; neighborhood: string } }) {
  const pathname = usePathname();
  const isPropertyPage = /^\/propiedades\/[^/]+\/?$/.test(pathname);
  if (isPropertyPage && !property) return null;

  const message = property
    ? `Hola, me interesa la propiedad “${property.title}” en ${property.neighborhood}. ¿Podrían enviarme más información?`
    : "Hola, quisiera consultar por una propiedad.";

  return (
    <a
      href={getWhatsAppUrl(message)}
      onClick={property ? (event) => {
        event.preventDefault();
        window.open(getWhatsAppUrl(`${message}\n\nEnlace: ${window.location.href}`), "_blank", "noopener,noreferrer");
      } : undefined}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-navy/20 transition-transform hover:scale-105"
    >
      <Icon name="whatsapp" className="size-7" />
    </a>
  );
}
