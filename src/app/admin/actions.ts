"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publishedPropertiesCacheTag } from "@/lib/properties";
import { isPropertyLocation } from "@/lib/property-locations";
import { propertyFeatures } from "@/lib/property-features";
import { isYoutubeUrl } from "@/lib/youtube";

export type LoginState = { error?: "setup" | "invalid" | "unauthorized" };

async function timed<T>(label: string, action: () => PromiseLike<T>): Promise<T> {
  const startedAt = performance.now();
  try {
    return await action();
  } finally {
    console.info(`[perf] ${label} duration_ms=${Math.round(performance.now() - startedAt)}`);
  }
}

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const startedAt = performance.now();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "setup" };

  const { error } = await timed("admin.login.signInWithPassword", () =>
    supabase.auth.signInWithPassword({
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    }),
  );
  if (error) {
    console.info(`[perf] admin.login.total duration_ms=${Math.round(performance.now() - startedAt)}`);
    return { error: "invalid" };
  }

  const { data } = await timed("admin.login.getClaims", () => supabase.auth.getClaims());
  const userId = data?.claims?.sub;
  const { data: admin } = typeof userId === "string"
    ? await timed("admin.login.adminUsersQuery", () =>
      supabase.from("admin_users").select("id").eq("id", userId).maybeSingle(),
    )
    : { data: null };

  if (!admin) {
    await timed("admin.login.signOut", () => supabase.auth.signOut());
    console.info(`[perf] admin.login.total duration_ms=${Math.round(performance.now() - startedAt)}`);
    return { error: "unauthorized" };
  }
  console.info(`[perf] admin.login.total duration_ms=${Math.round(performance.now() - startedAt)}`);
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
  const imageOrder = formData.getAll("image_order").map(String);
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
  const characteristics = formData.getAll("characteristics").map(String);
  const status = text(formData, "status");
  const currency = text(formData, "currency");
  const expensesText = text(formData, "expenses");
  const expenses = expensesText ? Number(expensesText) : null;
  const orientation = text(formData, "orientation");
  const disposition = text(formData, "disposition");
  const buildingAge = text(formData, "building_age");
  const garageCount = Number(text(formData, "garage_count"));
  const videoUrl = text(formData, "video_url");
  const orientations = ["", "Norte", "Noreste", "Este", "Sudeste", "Sur", "Sudoeste", "Oeste", "Noroeste"];
  const dispositions = ["", "Frente", "Contrafrente", "Lateral", "Interno"];
  const buildingAges = ["", "En pozo", "A estrenar", "1 a 10", "10 a 20", "20+"];
  const booleanOptions = ["true", "false"];
  const numbers = ["price", "rooms", "bedrooms", "bathrooms", "area", "covered_area", "uncovered_area", "semi_covered_area"];
  const values = numbers.map((name) => Number(text(formData, name)));
  const [price, rooms, bedrooms, bathrooms, area, coveredArea, uncoveredArea, semiCoveredArea] = values;
  const counts = values.slice(1);
  const neighborhood = text(formData, "neighborhood");
  const city = text(formData, "city");
  const street = text(formData, "street");
  const streetNumber = text(formData, "street_number");
  const floor = text(formData, "floor");
  const apartment = text(formData, "apartment");
  const valid = /^[0-9a-f-]{36}$/i.test(id) && title.length > 0 && title.length <= 200 &&
    slug.length > 0 && slug.length <= 120 && isPropertyLocation(city, neighborhood) &&
    street.length > 0 && street.length <= 150 && streetNumber.length > 0 && streetNumber.length <= 30 &&
    floor.length <= 30 && apartment.length <= 30 &&
    numbers.every((name) => text(formData, name) !== "") &&
    values.every((value) => Number.isFinite(value) && value >= 0) && Number.isInteger(price) && counts.every(Number.isInteger) &&
    (expenses === null || (Number.isFinite(expenses) && expenses >= 0)) &&
    orientations.includes(orientation) && dispositions.includes(disposition) &&
    ["venta", "alquiler"].includes(operation) && ["Departamento", "Casa", "PH", "Otro", "Lote", "Depósito", "Local comercial", "Cochera", "Oficina"].includes(propertyType) &&
    text(formData, "garage_count") !== "" && Number.isInteger(garageCount) && garageCount >= 0 &&
    booleanOptions.includes(text(formData, "accessible_ramp")) && booleanOptions.includes(text(formData, "apto_credito")) &&
    buildingAges.includes(buildingAge) && videoUrl.length <= 500 && isYoutubeUrl(videoUrl) &&
    new Set(characteristics).size === characteristics.length && characteristics.every((characteristic) => propertyFeatures.includes(characteristic as (typeof propertyFeatures)[number])) &&
    ["USD", "ARS"].includes(currency) && ["draft", "published"].includes(status) &&
    text(formData, "description").length <= 10000 && safeUploads.length === uploadedPaths.length &&
    new Set(uploadedPaths).size === uploadedPaths.length && new Set(imageOrder).size === imageOrder.length &&
    safeUploads.every((path) => imageOrder.includes(path));

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
  if (imageOrder.some((path) => !safeUploads.includes(path) && !existingImages.includes(path))) {
    await cleanupUploads();
    redirect(`/admin/propiedades/${page}?error=invalid`);
  }
  if (imageOrder.length > 20) {
    await cleanupUploads();
    redirect(`/admin/propiedades/${page}?error=images`);
  }

  const payload = {
    slug,
    title,
    operation,
    property_type: propertyType,
    neighborhood,
    city,
    street,
    street_number: streetNumber,
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
    uncovered_area: uncoveredArea,
    semi_covered_area: semiCoveredArea,
    garage_count: garageCount,
    accessible_ramp: text(formData, "accessible_ramp") === "true",
    building_age: buildingAge || null,
    apto_credito: text(formData, "apto_credito") === "true",
    characteristics,
    video_url: videoUrl || null,
    description: text(formData, "description"),
    images: imageOrder,
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

  const { error: addressError } = await supabase.from("property_private_addresses").upsert({
    property_id: id,
    floor: floor || null,
    apartment: apartment || null,
  });
  if (addressError) redirect(`/admin/propiedades/${page}?error=save`);

  const removed = existingImages.filter((path) => !imageOrder.includes(path));
  if (removed.length) await supabase.storage.from("property-images").remove(removed);
  updateTag(publishedPropertiesCacheTag);
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
  updateTag(publishedPropertiesCacheTag);
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${property.slug}`);
  redirect("/admin?notice=deleted");
}
