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
    default: "Nessi Inmobiliaria",
    template: "%s | Nessi Inmobiliaria",
  },
  description: "Nessi Inmobiliaria, de Rosana Nessi. Asesoramiento personalizado para comprar, vender o alquilar propiedades.",
  verification: {
    google: "PjdvfJSB-zQRe4W-E3Z7ERWpMyCWg3FuIPhBrotCms0",
  },
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
