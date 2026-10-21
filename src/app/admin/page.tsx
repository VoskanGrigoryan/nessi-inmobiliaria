import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { DeletePropertyForm } from "@/app/admin/delete-property-form";
import { requireAdmin } from "@/lib/supabase/admin";
import { getAdminProperties, formatPrice } from "@/lib/properties";

type PageProps = { searchParams: Promise<{ notice?: string; error?: string }> };

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: PageProps) {
  await requireAdmin();
  const [properties, params] = await Promise.all([getAdminProperties(), searchParams]);

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Administración</p>
          <h1 className="mt-2 font-editorial text-3xl text-navy">Propiedades</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/propiedades/nueva" className="bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-blue-deep">Nueva propiedad</Link>
          <form action={logout}><button className="border border-navy/15 px-4 py-3 text-sm text-navy hover:border-gold">Salir</button></form>
        </div>
      </div>

      {params.notice === "saved" && <p className="mt-6 bg-green-50 p-3 text-sm text-green-800">La propiedad se guardó correctamente.</p>}
      {params.notice === "deleted" && <p className="mt-6 bg-green-50 p-3 text-sm text-green-800">La propiedad se eliminó.</p>}
      {params.error && <p role="alert" className="mt-6 bg-red-50 p-3 text-sm text-red-800">No se pudo completar la operación. Volvé a intentarlo.</p>}

      {properties.length ? (
        <div className="mt-8 overflow-x-auto border border-navy/10 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-navy/10 bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-4 py-3">Propiedad</th><th className="px-4 py-3">Operación</th><th className="px-4 py-3">Precio</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Acciones</th></tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-navy/10 last:border-0">
                  <td className="px-4 py-4 font-medium text-navy">{property.title}<span className="mt-1 block text-xs font-normal text-muted">{property.neighborhood}, {property.city}</span></td>
                  <td className="px-4 py-4 capitalize text-slate">{property.operation}</td>
                  <td className="px-4 py-4 text-slate">{formatPrice(property.price, property.currency)}</td>
                  <td className="px-4 py-4 text-slate">{property.status === "published" ? "Publicado" : "Borrador"}</td>
                  <td className="px-4 py-4"><div className="flex items-center gap-4">
                    <Link href={`/admin/propiedades/${property.id}/editar`} className="font-medium text-navy underline">Editar</Link>
                    <DeletePropertyForm id={property.id ?? ""} />
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 border border-navy/10 bg-white p-8 text-sm text-slate">Todavía no hay propiedades. Creá la primera para empezar.</div>
      )}
    </main>
  );
}
