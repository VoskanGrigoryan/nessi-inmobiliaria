import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nessi Inmobiliaria",
  description: "Encontrá tu próximo hogar con Nessi Inmobiliaria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-stone-50 text-stone-950 antialiased">
        {children}
      </body>
    </html>
  );
}
