import { Icon } from "@/components/icon";
import { getWhatsAppUrl } from "@/lib/properties";

export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl("Hola, quisiera consultar por una propiedad.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-navy/20 transition-transform hover:scale-105"
    >
      <Icon name="whatsapp" className="size-7" />
    </a>
  );
}
