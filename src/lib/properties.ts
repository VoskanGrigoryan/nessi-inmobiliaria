import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { PropertyFeature } from "@/lib/property-features";
import type { PropertySubtype } from "@/lib/property-subtypes";
import type { PropertyAvailabilityStatus } from "@/lib/property-availability";

export type Operation = "venta" | "alquiler" | "alquiler_temporal";
export const operationLabels: Record<Operation, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  alquiler_temporal: "Alquiler temporal",
};
export const operationBadgeLabels: Record<Operation, string> = {
  venta: "En venta",
  alquiler: "En alquiler",
  alquiler_temporal: "Alquiler temporal",
};
export type Orientation = "Norte" | "Noreste" | "Este" | "Sudeste" | "Sur" | "Sudoeste" | "Oeste" | "Noroeste";
export type Disposition = "Frente" | "Contrafrente" | "Lateral" | "Interno";
export type PropertyType = "Departamento" | "Casa" | "PH" | "Otro" | "Lote" | "Depósito" | "Local comercial" | "Cochera" | "Oficina";
export type BuildingAge = "En pozo" | "A estrenar" | "1 a 10" | "10 a 20" | "20+";

export type Property = {
  id?: string;
  slug: string;
  title: string;
  operation: Operation;
  type: PropertyType;
  subtype?: PropertySubtype | null;
  neighborhood: string;
  city: string;
  street?: string;
  streetNumber?: string;
  floor?: string | null;
  apartment?: string | null;
  price: number;
  expenses?: number | null;
  orientation?: Orientation | null;
  disposition?: Disposition | null;
  currency: "USD" | "ARS";
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coveredArea: number;
  garageCount?: number;
  uncoveredArea?: number;
  semiCoveredArea?: number;
  accessibleRamp?: boolean;
  buildingAge?: BuildingAge | null;
  aptoCredito?: boolean;
  characteristics: PropertyFeature[];
  videoUrl?: string | null;
  description: string;
  image: string;
  gallery: string[];
  imagePaths?: string[];
  floorPlans?: string[];
  floorPlanPaths?: string[];
  featured?: boolean;
  status?: "published" | "draft";
  availabilityStatus: PropertyAvailabilityStatus;
};

export type PropertyCardData = Pick<
  Property,
  | "id"
  | "slug"
  | "title"
  | "operation"
  | "availabilityStatus"
  | "type"
  | "subtype"
  | "neighborhood"
  | "city"
  | "street"
  | "streetNumber"
  | "price"
  | "expenses"
  | "currency"
  | "rooms"
  | "bathrooms"
  | "area"
  | "image"
  | "featured"
>;

type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  operation: Operation;
  property_type: PropertyType;
  property_subtype: PropertySubtype | null;
  neighborhood: string;
  city: string;
  street: string;
  street_number: string;
  property_private_addresses?: { floor: string | null; apartment: string | null } | null;
  price: number;
  expenses: number | null;
  orientation: Orientation | null;
  disposition: Disposition | null;
  currency: Property["currency"];
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  covered_area: number;
  garage_count: number;
  uncovered_area: number;
  semi_covered_area: number;
  accessible_ramp: boolean;
  building_age: BuildingAge | null;
  apto_credito: boolean;
  characteristics: PropertyFeature[];
  video_url: string | null;
  description: string;
  images: string[];
  floor_plans: string[];
  featured: boolean;
  status: Property["status"];
  availability_status: PropertyAvailabilityStatus;
};

type PropertyCardRow = Pick<
  PropertyRow,
  | "id"
  | "slug"
  | "title"
  | "operation"
  | "availability_status"
  | "property_type"
  | "property_subtype"
  | "neighborhood"
  | "city"
  | "street"
  | "street_number"
  | "price"
  | "expenses"
  | "currency"
  | "rooms"
  | "bathrooms"
  | "area"
  | "images"
  | "featured"
>;

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

export const publishedPropertiesCacheTag = "published-properties";

function createPublishedPropertiesClient(url: string, key: string) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        next: { revalidate: 3600, tags: [publishedPropertiesCacheTag] },
      }),
    },
  });
}

export const sampleProperties: Property[] = [
  {
    slug: "departamento-con-balcon-en-palermo",
    title: "Departamento luminoso con balcón",
    operation: "venta",
    availabilityStatus: "available",
    type: "Departamento",
    neighborhood: "Palermo",
    city: "CABA",
    price: 189000,
    currency: "USD",
    orientation: "Noreste",
    disposition: "Frente",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    area: 84,
    coveredArea: 76,
    characteristics: ["Balcón", "Parrilla", "Lavadero"],
    description:
      "Un espacio amplio y luminoso, con ambientes cómodos y un balcón ideal para disfrutar la ciudad.",
    image: photo("photo-1663756915301-2ba688e078cf"),
    gallery: [
      photo("photo-1663756915301-2ba688e078cf"),
      photo("photo-1665249934445-1de680641f50"),
      photo("photo-1771287491132-4954b32210d6"),
    ],
    featured: true,
  },
  {
    slug: "departamento-moderno-en-belgrano",
    title: "Departamento moderno y funcional",
    operation: "alquiler",
    availabilityStatus: "available",
    type: "Departamento",
    neighborhood: "Belgrano",
    city: "CABA",
    price: 950000,
    currency: "ARS",
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: 48,
    coveredArea: 44,
    characteristics: ["Aire acondicionado", "Lavadero"],
    description:
      "Un departamento práctico, con cocina integrada y una distribución que aprovecha cada ambiente.",
    image: photo("photo-1753911372224-2b56c07cc737"),
    gallery: [
      photo("photo-1753911372224-2b56c07cc737"),
      photo("photo-1771287491132-4954b32210d6"),
    ],
    featured: true,
  },
  {
    slug: "casa-con-jardin-en-villa-devoto",
    title: "Casa con jardín y espacios abiertos",
    operation: "venta",
    availabilityStatus: "available",
    type: "Casa",
    neighborhood: "Villa Devoto",
    city: "CABA",
    price: 275000,
    currency: "USD",
    rooms: 5,
    bedrooms: 3,
    bathrooms: 2,
    area: 185,
    coveredArea: 148,
    characteristics: ["Jardín", "Parrilla", "Pileta"],
    description:
      "Una casa para disfrutar en familia, con ambientes generosos y conexión con el exterior.",
    image: photo("photo-1774979517612-db480ae5b587"),
    gallery: [
      photo("photo-1774979517612-db480ae5b587"),
      photo("photo-1665249934445-1de680641f50"),
      photo("photo-1663756915301-2ba688e078cf"),
    ],
    featured: true,
  },
  {
    slug: "ph-refaccionado-en-recoleta",
    title: "PH reciclado con detalles originales",
    operation: "venta",
    availabilityStatus: "available",
    type: "PH",
    neighborhood: "Recoleta",
    city: "CABA",
    price: 157000,
    currency: "USD",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    area: 72,
    coveredArea: 66,
    characteristics: ["Terraza", "Lavadero"],
    description:
      "Un PH cálido que combina detalles de época con una puesta en valor actual y luminosa.",
    image: photo("photo-1771287491132-4954b32210d6"),
    gallery: [
      photo("photo-1771287491132-4954b32210d6"),
      photo("photo-1663756915301-2ba688e078cf"),
    ],
  },
];

function toProperty(
  row: PropertyRow,
  getImageUrl: (path: string) => string,
  getFloorPlanUrl: (path: string) => string,
): Property {
  const gallery = (row.images ?? []).map((path) =>
    path.startsWith("http") ? path : getImageUrl(path),
  );
  const floorPlanPaths = row.floor_plans ?? [];
  const floorPlans = floorPlanPaths.map((path) =>
    path.startsWith("http") ? path : getFloorPlanUrl(path),
  );
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    operation: row.operation,
    type: row.property_type,
    subtype: row.property_subtype,
    neighborhood: row.neighborhood,
    city: row.city,
    street: row.street,
    streetNumber: row.street_number,
    floor: row.property_private_addresses?.floor ?? null,
    apartment: row.property_private_addresses?.apartment ?? null,
    price: row.price,
    expenses: row.expenses,
    orientation: row.orientation,
    disposition: row.disposition,
    currency: row.currency,
    rooms: row.rooms,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    coveredArea: row.covered_area,
    garageCount: row.garage_count ?? 0,
    uncoveredArea: row.uncovered_area ?? 0,
    semiCoveredArea: row.semi_covered_area ?? 0,
    accessibleRamp: row.accessible_ramp ?? false,
    buildingAge: row.building_age,
    aptoCredito: row.apto_credito ?? false,
    characteristics: row.characteristics ?? [],
    videoUrl: row.video_url,
    description: row.description,
    gallery,
    imagePaths: row.images ?? [],
    floorPlans,
    floorPlanPaths,
    image: gallery[0] ?? "",
    featured: row.featured,
    status: row.status,
    availabilityStatus: row.availability_status,
  };
}

function toPropertyCardData(
  row: PropertyCardRow,
  getImageUrl: (path: string) => string,
): PropertyCardData {
  const imagePath = row.images?.[0] ?? "";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    operation: row.operation,
    availabilityStatus: row.availability_status,
    type: row.property_type,
    subtype: row.property_subtype,
    neighborhood: row.neighborhood,
    city: row.city,
    street: row.street,
    streetNumber: row.street_number,
    price: row.price,
    expenses: row.expenses,
    currency: row.currency,
    rooms: row.rooms,
    bathrooms: row.bathrooms,
    area: row.area,
    image: imagePath.startsWith("http") ? imagePath : imagePath ? getImageUrl(imagePath) : "",
    featured: row.featured,
  };
}

function escapeLikeFilter(value: string) {
  return value.replace(/[\\%_"]/g, (character) => `\\${character}`);
}

type PropertyFilters = {
  currency?: Property["currency"];
  maximumPrice?: number;
  operation?: string;
  minimumPrice?: number;
  type?: string;
  subtype?: string;
  minimumRooms?: number;
  location?: string;
  sort?: "newest" | "price_asc" | "price_desc";
};

type PropertyListResult = { properties: PropertyCardData[]; total: number };
type Pagination = { page: number; pageSize: number };

async function getPropertyResults(
  filters: PropertyFilters = {},
  pagination?: Pagination,
): Promise<PropertyListResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    const properties = process.env.NODE_ENV === "production" ? [] : sampleProperties;
    const filtered = properties.map((property) => ({
      id: property.id,
      slug: property.slug,
      title: property.title,
      operation: property.operation,
      availabilityStatus: property.availabilityStatus,
      type: property.type,
      subtype: property.subtype,
      neighborhood: property.neighborhood,
      city: property.city,
      street: property.street,
      streetNumber: property.streetNumber,
      price: property.price,
      expenses: property.expenses,
      currency: property.currency,
      rooms: property.rooms,
      bathrooms: property.bathrooms,
      area: property.area,
      image: property.image,
      featured: property.featured,
    })).filter((property) => {
      const location = filters.location?.trim().toLocaleLowerCase("es-AR");
      const propertyLocation = `${property.neighborhood} ${property.city}`.toLocaleLowerCase("es-AR");
      return (
        ["available", "reserved"].includes(property.availabilityStatus) &&
        (!filters.operation || property.operation === filters.operation) &&
        (!filters.type || property.type === filters.type) &&
        (!filters.subtype || property.subtype === filters.subtype) &&
        (!filters.currency || property.currency === filters.currency) &&
        (!filters.currency || filters.minimumPrice === undefined || property.price >= filters.minimumPrice) &&
        (!filters.currency || filters.maximumPrice === undefined || property.price <= filters.maximumPrice) &&
        (!location || propertyLocation.includes(location)) &&
        property.rooms >= (filters.minimumRooms || 0)
      );
    }).sort((left, right) => filters.currency && filters.sort === "price_asc"
      ? left.price - right.price
      : filters.currency && filters.sort === "price_desc"
        ? right.price - left.price
        : 0);
    const total = filtered.length;
    const start = pagination ? (pagination.page - 1) * pagination.pageSize : 0;
    return {
      properties: pagination ? filtered.slice(start, start + pagination.pageSize) : filtered,
      total,
    };
  }

  const supabase = createPublishedPropertiesClient(url, key);
  const fields = "id,slug,title,operation,availability_status,property_type,property_subtype,neighborhood,city,street,street_number,price,expenses,currency,rooms,bathrooms,area,images,featured";
  let query = pagination
    ? supabase.from("properties").select(fields, { count: "exact" })
    : supabase.from("properties").select(fields);
  query = query
    .eq("status", "published")
    .in("availability_status", ["available", "reserved"]);

  if (filters.operation) query = query.eq("operation", filters.operation);
  if (filters.type) query = query.eq("property_type", filters.type);
  if (filters.subtype) query = query.eq("property_subtype", filters.subtype);
  if (filters.currency) query = query.eq("currency", filters.currency);
  if (filters.currency && filters.minimumPrice !== undefined && Number.isFinite(filters.minimumPrice)) {
    query = query.gte("price", filters.minimumPrice);
  }
  if (filters.currency && filters.maximumPrice !== undefined && Number.isFinite(filters.maximumPrice)) {
    query = query.lte("price", filters.maximumPrice);
  }
  if (filters.minimumRooms && Number.isFinite(filters.minimumRooms)) {
    query = query.gte("rooms", filters.minimumRooms);
  }
  const location = filters.location?.trim();
  if (location) {
    const pattern = `"%${escapeLikeFilter(location)}%"`;
    query = query.or(`neighborhood.ilike.${pattern},city.ilike.${pattern}`);
  }

  const orderedQuery = filters.currency && filters.sort === "price_asc"
    ? query.order("price", { ascending: true })
    : filters.currency && filters.sort === "price_desc"
      ? query.order("price", { ascending: false })
      : query.order("created_at", { ascending: false });
  const mapProperties = (rows: PropertyCardRow[] | null) => (rows ?? []).map((row) =>
    toPropertyCardData(
      row,
      (path) => supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl,
    ),
  );

  if (pagination) {
    const start = (pagination.page - 1) * pagination.pageSize;
    const { data, count } = await orderedQuery.range(start, start + pagination.pageSize - 1);
    return { properties: mapProperties(data as PropertyCardRow[] | null), total: count ?? 0 };
  }

  const { data } = await orderedQuery;
  const mapped = mapProperties(data as PropertyCardRow[] | null);
  return { properties: mapped, total: mapped.length };
}

export async function getProperties(filters: PropertyFilters = {}): Promise<PropertyCardData[]> {
  return (await getPropertyResults(filters)).properties;
}

export async function getPaginatedProperties(
  filters: PropertyFilters,
  page: number,
  pageSize = 9,
): Promise<PropertyListResult> {
  const normalizedPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  return getPropertyResults(filters, { page: normalizedPage, pageSize });
}

export const getPropertyBySlug = cache(async (slug: string) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return process.env.NODE_ENV === "production"
      ? undefined
      : sampleProperties.find((property) => property.slug === slug);
  }

  const startedAt = performance.now();
  const supabase = createPublishedPropertiesClient(url, key);
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  console.info(`[perf] property.detail.query duration_ms=${Math.round(performance.now() - startedAt)}`);

  return data
    ? toProperty(
        data as PropertyRow,
        (path) => supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl,
        (path) => supabase.storage.from("property-plans").getPublicUrl(path).data.publicUrl,
      )
    : undefined;
});

export async function getAdminProperties() {
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("properties")
    .select("*,property_private_addresses(floor,apartment)")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) =>
    toProperty(
      row as PropertyRow,
      (path) => supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl,
      (path) => supabase.storage.from("property-plans").getPublicUrl(path).data.publicUrl,
    ),
  );
}

export function formatPrice(price: number, currency: Property["currency"]) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    currencyDisplay: "code",
  }).format(price);
}
