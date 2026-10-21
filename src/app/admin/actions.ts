"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=1");

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) redirect("/admin/login?error=invalid");

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  const { data: admin } = typeof userId === "string"
    ? await supabase.from("admin_users").select("id").eq("id", userId).maybeSingle()
    : { data: null };

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function saveProperty(formData: FormData) {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const isNew = formData.get("is_new") === "true";
  const page = isNew ? "nueva" : `${id}/editar`;
  const uploadedPaths = formData.getAll("uploaded_images").map(String);
  const safeUploads = uploadedPaths.filter((path) =>
    path.startsWith(`${id}/`) && /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/i.test(path),
  );
  const cleanupUploads = async () => {
    if (safeUploads.length) await supabase.storage.from("property-images").remove(safeUploads);
  };

  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const operation = text(formData, "operation");
  const propertyType = text(formData, "property_type");
  const status = text(formData, "status");
  const currency = text(formData, "currency");
  const expensesText = text(formData, "expenses");
  const expenses = expensesText ? Number(expensesText) : null;
  const orientation = text(formData, "orientation");
  const disposition = text(formData, "disposition");
  const orientations = ["", "Norte", "Noreste", "Este", "Sudeste", "Sur", "Sudoeste", "Oeste", "Noroeste"];
  const dispositions = ["", "Frente", "Contrafrente"];
  const numbers = ["price", "rooms", "bedrooms", "bathrooms", "area", "covered_area"];
  const values = numbers.map((name) => Number(text(formData, name)));
  const [price, rooms, bedrooms, bathrooms, area, coveredArea] = values;
  const counts = [rooms, bedrooms, bathrooms, area, coveredArea];
  const valid = /^[0-9a-f-]{36}$/i.test(id) && title.length > 0 && title.length <= 200 &&
    slug.length > 0 && slug.length <= 120 && text(formData, "neighborhood").length > 0 &&
    text(formData, "city").length > 0 && numbers.every((name) => text(formData, name) !== "") &&
    values.every((value) => Number.isFinite(value) && value >= 0) && counts.every(Number.isInteger) &&
    (expenses === null || (Number.isFinite(expenses) && expenses >= 0)) &&
    orientations.includes(orientation) && dispositions.includes(disposition) &&
    ["venta", "alquiler"].includes(operation) && ["Departamento", "Casa", "PH"].includes(propertyType) &&
    ["USD", "ARS"].includes(currency) && ["draft", "published"].includes(status) &&
    text(formData, "description").length <= 10000 && safeUploads.length === uploadedPaths.length;

  if (!valid) {
    await cleanupUploads();
    redirect(`/admin/propiedades/${page}?error=invalid`);
  }

  const { data: oldProperty } = await supabase.from("properties")
    .select("slug, images").eq("id", id).maybeSingle();
  if ((isNew && oldProperty) || (!isNew && !oldProperty)) {
    await cleanupUploads();
    redirect(isNew ? "/admin?error=exists" : "/admin?error=missing");
  }

  const existingImages = (oldProperty?.images as string[] | undefined) ?? [];
  const removeImages = new Set(formData.getAll("remove_images").map(String));
  const keptImages = existingImages.filter((path) => !removeImages.has(path));
  if (keptImages.length + uploadedPaths.length > 20) {
    await cleanupUploads();
    redirect(`/admin/propiedades/${page}?error=images`);
  }

  const payload = {
    slug,
    title,
    operation,
    property_type: propertyType,
    neighborhood: text(formData, "neighborhood"),
    city: text(formData, "city"),
    price,
    expenses,
    orientation: orientation || null,
    disposition: disposition || null,
    currency,
    rooms,
    bedrooms,
    bathrooms,
    area,
    covered_area: coveredArea,
    description: text(formData, "description"),
    images: [...keptImages, ...uploadedPaths],
    featured: formData.get("featured") === "on",
    status,
    updated_at: new Date().toISOString(),
  };
  const result = isNew
    ? await supabase.from("properties").insert({ ...payload, id }).select("slug").single()
    : await supabase.from("properties").update(payload).eq("id", id).select("slug").single();

  if (result.error) {
    await cleanupUploads();
    redirect(`/admin/propiedades/${page}?error=save`);
  }

  const removed = existingImages.filter((path) => removeImages.has(path));
  if (removed.length) await supabase.storage.from("property-images").remove(removed);
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${result.data.slug}`);
  if (oldProperty?.slug && oldProperty.slug !== result.data.slug) revalidatePath(`/propiedades/${oldProperty.slug}`);
  redirect("/admin?notice=saved");
}

export async function deleteProperty(formData: FormData) {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const { data: property } = await supabase.from("properties")
    .select("slug, images").eq("id", id).maybeSingle();
  if (!property) redirect("/admin?error=missing");

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) redirect("/admin?error=delete");

  const images = property.images as string[];
  if (images.length) await supabase.storage.from("property-images").remove(images);
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${property.slug}`);
  redirect("/admin?notice=deleted");
}
