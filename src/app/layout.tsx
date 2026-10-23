import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteHeaderAuthProvider } from "@/components/site-header-auth";
import { PropertyFavoritesProvider } from "@/components/property-favorites";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RN Negocios Inmobiliarios",
    template: "%s | RN Negocios Inmobiliarios",
  },
  description: "Propiedades en venta y alquiler con el asesoramiento cercano de Rosana Nessi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-paper text-navy antialiased">
        <SiteHeaderAuthProvider>
          <PropertyFavoritesProvider>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
          </PropertyFavoritesProvider>
        </SiteHeaderAuthProvider>
        <SiteFooter />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}
