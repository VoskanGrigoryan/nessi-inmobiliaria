import Link from "next/link";
import * as motion from "motion/react-client";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6">
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="font-semibold tracking-wide">
          NESSI <span className="font-normal text-stone-500">Inmobiliaria</span>
        </Link>
        <Link
          href="#propiedades"
          className="text-sm text-stone-600 transition-colors hover:text-stone-950"
        >
          Propiedades
        </Link>
      </header>

      <section className="flex min-h-[65vh] items-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-emerald-800">
            Nessi Inmobiliaria
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Encontrá tu próximo lugar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Explorá propiedades y encontrá un espacio para tu próxima etapa.
          </p>
          <Link
            href="#propiedades"
            className="mt-8 inline-flex rounded-md bg-emerald-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            Ver propiedades
          </Link>
        </motion.div>
      </section>

      <section id="propiedades" className="border-t border-stone-200 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Propiedades</h2>
        <p className="mt-3 text-stone-600">El catálogo estará disponible acá.</p>
      </section>
    </main>
  );
}
