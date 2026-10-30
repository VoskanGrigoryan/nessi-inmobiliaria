import { BackLink } from "@/components/back-link";
import { LoginForm } from "@/app/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <BackLink href="/" label="Volver al sitio" className="mb-5" />
        <section className="rounded-xl border border-navy/15 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-editorial text-3xl text-navy">Acceso inmobiliaria</h1>
          <p className="mt-2 text-sm leading-6 text-slate">Ingresá con la cuenta de administración.</p>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
