import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";
import {
  HeaderAdminLink,
  HeaderLoginLink,
  MobileNavigation,
  SiteHeaderVisibility,
} from "@/components/site-header-auth";

const navLinkClassName = "relative py-2 text-base font-semibold tracking-wide text-white transition-colors hover:text-gold-light after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:text-gold-light focus-visible:after:scale-x-100";

export function SiteHeader() {
  return (
    <SiteHeaderVisibility>
      <>
        <header className="border-b border-gold/25 bg-navy">
          <div className="flex w-full items-center justify-between gap-6 px-5 py-2.5">
            <Link href="/" aria-label="Rosana Nessi Negocios Inmobiliarios, inicio" className="flex shrink-0 items-center">
              <Image
                src="/rosana-nessi-mark.png"
                alt="Rosana Nessi Negocios Inmobiliarios"
                width={228}
                height={147}
                priority
                className="h-11 w-[68px] object-contain sm:h-14 sm:w-[88px]"
              />
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
