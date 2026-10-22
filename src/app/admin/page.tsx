import Link from "next/link";
import { DeletePropertyForm } from "@/app/admin/delete-property-form";
import { LogoutButton } from "@/app/admin/logout-button";
import { requireAdmin } from "@/lib/supabase/admin";
import { getAdminProperties, formatPrice } from "@/lib/properties";
import { Icon } from "@/components/icon";
import { RefreshPropertiesButton } from "@/app/admin/refresh-properties-button";
import { AdminToast } from "@/app/admin/admin-toast";
import { EditPropertyLink, ViewPropertyLink } from "@/app/admin/edit-property-link";
import { CopyPropertyLink } from "@/app/admin/copy-property-link";

type PageProps = { searchParams: Promise<{ notice?: string; error?: string }> };

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: PageProps) {
  await requireAdmin();
  const [properties, params] = await Promise.all([getAdminProperties(), searchParams]);
  const noticeMessage = params.notice === "saved"
    ? "La propiedad se guardó correctamente."
    : params.notice === "deleted"
      ? "La propiedad se eliminó correctamente."
      : undefined;

  return (
    <main className="mx-auto min-h-[70vh] w-full px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Administración</p>
          <h1 className="mt-2 font-editorial text-3xl text-navy">Propiedades</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/propiedades/nueva" className="inline-flex cursor-pointer items-center gap-2 bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-blue-deep"><Icon name="plus" className="size-4" />Nueva propiedad</Link>
          <RefreshPropertiesButton />
          <LogoutButton />
        </div>
      </div>

      {params.error ? (
        <AdminToast variant="error" message="No se pudo completar la operación. Volvé a intentarlo." />
      ) : noticeMessage ? (
        <AdminToast variant="success" message={noticeMessage} />
      ) : null}

      {properties.length ? (
        <div className="mt-8 overflow-x-auto border border-navy/10 bg-white">
          <table className="w-full min-w-[900px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[42%]" /><col className="w-[7%]" /><col className="w-[12%]" />
              <col className="w-[14%]" /><col className="w-[13%]" /><col className="w-[12%]" />
            </colgroup>
            <thead className="border-b border-navy/10 bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-4 py-3">Propiedad</th><th className="px-4 py-3 text-center">Enlace</th><th className="px-4 py-3">Operación</th><th className="px-4 py-3">Precio</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Acciones</th></tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-navy/10 last:border-0">
                  <td className="break-words px-4 py-4 font-medium text-navy">
                    {property.status === "published" ? (
                      <ViewPropertyLink href={`/propiedades/${property.slug}`} title={property.title} />
                    ) : property.title}
                    <span className="mt-1 block text-xs font-normal text-muted">{property.neighborhood}, {property.city}</span>
                    <span className="mt-1 block text-xs font-normal text-muted">{property.rooms} ambientes · {property.area} m² totales</span>
                  </td>
                  <td className="px-4 py-4 text-center"><CopyPropertyLink href={`/propiedades/${property.slug}`} title={property.title} disabled={property.status !== "published"} /></td>
                  <td className="px-4 py-4 capitalize text-slate">{property.operation}</td>
                  <td className="px-4 py-4 text-slate">{formatPrice(property.price, property.currency)}</td>
                  <td className="px-4 py-4 text-slate">{property.status === "published" ? "Publicado" : "Borrador"}</td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2">
                    <EditPropertyLink href={`/admin/propiedades/${property.id}/editar`} title={property.title} />
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
