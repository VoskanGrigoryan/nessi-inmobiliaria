import Link from "next/link";
import { Icon } from "@/components/icon";
import {
  HeaderAdminLink,
  HeaderLoginLink,
  MobileNavigation,
  SiteHeaderVisibility,
} from "@/components/site-header-auth";

const navLinkClassName = "relative py-2 text-base font-semibold tracking-wide text-blue-deep transition-colors hover:text-gold after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:text-gold focus-visible:after:scale-x-100";

export function SiteHeader() {
  return (
    <SiteHeaderVisibility>
      <>
        <div className="bg-navy px-5 py-2 text-center text-[10px] tracking-[0.18em] text-gold-light sm:text-xs">
          MARTILLERA P&Uacute;BLICA &middot; MATR&Iacute;CULA CUCICBA 9935
        </div>
        <header className="border-b border-navy/10 bg-white">
          <div className="flex w-full items-center justify-between gap-6 px-5 py-4">
            <Link href="/" aria-label="RN Negocios Inmobiliarios, inicio" className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold text-gold">
                <span className="font-editorial text-2xl italic leading-none">Rn</span>
              </span>
              <span className="leading-tight">
                <span className="block font-editorial text-lg text-navy sm:text-xl">Rosana Nessi</span>
                <span className="mt-1 block text-[9px] font-medium tracking-[0.19em] text-slate sm:text-[10px]">
                  NEGOCIOS INMOBILIARIOS
                </span>
              </span>
            </Link>

            <nav aria-label={"Navegaci\u00f3n principal"} className="hidden items-center gap-9 md:flex">
              <HeaderAdminLink className={navLinkClassName} />
              <Link href="/" className={navLinkClassName}>Inicio</Link>
              <Link href="/propiedades" className={navLinkClassName}>Propiedades</Link>
              <Link href="/nosotros" className={navLinkClassName}>Nosotros</Link>
              <Link href="/contacto" className={navLinkClassName}>Contacto</Link>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <MobileNavigation />
              <HeaderLoginLink icon={<Icon name="userKey" className="size-5" />} />
            </div>
          </div>
        </header>
      </>
    </SiteHeaderVisibility>
  );
}
