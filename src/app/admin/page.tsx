import Link from "next/link";
import { DeletePropertyForm } from "@/app/admin/delete-property-form";
import { LogoutButton } from "@/app/admin/logout-button";
import { requireAdminContext } from "@/lib/supabase/admin";
import { getAdminProperties, formatPrice } from "@/lib/properties";
import { Icon } from "@/components/icon";
import { RefreshPropertiesButton } from "@/app/admin/refresh-properties-button";
import { AdminToast } from "@/app/admin/admin-toast";
import { EditPropertyLink, ViewPropertyLink } from "@/app/admin/edit-property-link";
import { CopyPropertyLink } from "@/app/admin/copy-property-link";

type PageProps = { searchParams: Promise<{ notice?: string; error?: string }> };

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: PageProps) {
  const { email } = await requireAdminContext();
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
          {email && <p className="mb-2 break-all text-sm font-semibold text-navy">{email}</p>}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Administración</p>
          <h1 className="mt-2 font-editorial text-3xl text-navy">Propiedades</h1>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
          <Link href="/admin/propiedades/nueva" className="col-span-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-blue-deep sm:col-span-1 sm:w-auto"><Icon name="plus" className="size-4" />Nueva propiedad</Link>
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
        <>
        <div className="mt-8 grid gap-3 md:hidden">
          {properties.map((property) => (
            <article key={property.id} className="min-w-0 border border-navy/10 bg-white p-4">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-navy">
                    {property.status === "published" ? (
                      <ViewPropertyLink href={`/propiedades/${property.slug}`} title={property.title} />
                    ) : property.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{property.neighborhood}, {property.city}</p>
                </div>
                <CopyPropertyLink href={`/propiedades/${property.slug}`} title={property.title} disabled={property.status !== "published"} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <span className="capitalize text-slate">{property.operation}</span>
                <span className="text-slate">{property.status === "published" ? "Publicado" : "Borrador"}</span>
                <span className="font-semibold text-navy">{formatPrice(property.price, property.currency)}</span>
                <span className="text-slate">{property.rooms} ambientes · {property.area} m²</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-navy/10 pt-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">Acciones</span>
                <div className="flex items-center gap-2">
                  <EditPropertyLink href={`/admin/propiedades/${property.id}/editar`} title={property.title} />
                  <DeletePropertyForm id={property.id ?? ""} />
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 hidden overflow-x-auto border border-navy/10 bg-white md:block">
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
        </>
      ) : (
        <div className="mt-8 border border-navy/10 bg-white p-8 text-sm text-slate">Todavía no hay propiedades. Creá la primera para empezar.</div>
      )}
    </main>
  );
}
