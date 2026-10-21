import { BackLink } from "@/components/back-link";
import { login } from "@/app/admin/actions";

type PageProps = { searchParams: Promise<{ error?: string; setup?: string }> };

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <main className="mx-auto min-h-[70vh] max-w-md px-5 py-16">
      <BackLink href="/" label="Volver al sitio" />
      <h1 className="mt-8 font-editorial text-3xl text-navy">Acceso inmobiliaria</h1>
      <p className="mt-2 text-sm leading-6 text-slate">Ingresá con la cuenta de administración.</p>
      {params.setup && <p role="alert" className="mt-5 bg-sand/50 p-3 text-sm text-navy">Falta configurar Supabase. Consultá el README.</p>}
      {params.error === "invalid" && <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-800">El email o la contraseña no son correctos.</p>}
      {params.error === "unauthorized" && <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-800">La cuenta no tiene permisos de administración.</p>}
      <form action={login} className="mt-7 space-y-4">
        <label className="block text-xs font-medium text-slate">Email
          <input required type="email" name="email" autoComplete="username" className="mt-2 h-12 w-full border border-navy/15 bg-white px-3 text-sm text-navy outline-none focus:border-gold" />
        </label>
        <label className="block text-xs font-medium text-slate">Contraseña
          <input required type="password" name="password" autoComplete="current-password" className="mt-2 h-12 w-full border border-navy/15 bg-white px-3 text-sm text-navy outline-none focus:border-gold" />
        </label>
        <button className="h-12 w-full bg-navy text-sm font-semibold text-white hover:bg-blue-deep">Ingresar</button>
      </form>
    </main>
  );
}
