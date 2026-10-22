import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { requireAdmin } from "@/lib/supabase/admin";
import { saveProperty } from "@/app/admin/actions";
import { PropertyForm } from "@/app/admin/property-form";
import { getAdminProperties } from "@/lib/properties";
import { AdminToast } from "@/app/admin/admin-toast";

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
      <h1 className="mt-5 font-editorial text-3xl text-navy">Editar propiedad</h1>
      {error && <AdminToast variant="error" message={error === "images" ? "La propiedad puede tener hasta 20 fotos." : "Revisá los datos e intentá de nuevo."} />}
      <div className="mt-8 border border-navy/10 bg-white p-5 sm:p-8"><PropertyForm key={id} property={property} propertyId={id} action={saveProperty} /></div>
    </main>
  );
}
