import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { requireAdmin } from "@/lib/supabase/admin";
import { saveProperty } from "@/app/admin/actions";
import { PropertyForm } from "@/app/admin/property-form";
import { getAdminProperties } from "@/lib/properties";
import { AdminToast } from "@/app/admin/admin-toast";
import { DeletePropertyForm } from "@/app/admin/delete-property-form";

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({ params, searchParams }: PageProps) {
  await requireAdmin();
  const [{ id }, { error }, properties] = await Promise.all([params, searchParams, getAdminProperties()]);
  const property = properties.find((item) => item.id === id);
  if (!property) notFound();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <BackLink href="/admin" label="Volver al panel" />
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-editorial text-3xl text-navy">Editar propiedad</h1>
        <DeletePropertyForm id={id} label="Eliminar propiedad" />
      </div>
      {error && <AdminToast variant="error" message={error === "images" ? "La propiedad puede tener hasta 20 fotos." : "Revisá los datos e intentá de nuevo."} />}
      <div className="mt-8 border border-navy/10 bg-white p-5 sm:p-8"><PropertyForm key={id} property={property} propertyId={id} action={saveProperty} /></div>
    </main>
  );
}
