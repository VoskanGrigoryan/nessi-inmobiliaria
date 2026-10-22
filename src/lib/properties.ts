import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { PropertyAmenity } from "@/lib/property-amenities";

export type Operation = "venta" | "alquiler";
export type Orientation = "Norte" | "Noreste" | "Este" | "Sudeste" | "Sur" | "Sudoeste" | "Oeste" | "Noroeste";
export type Disposition = "Frente" | "Contrafrente";

export type Property = {
  id?: string;
  slug: string;
  title: string;
  operation: Operation;
  type: "Departamento" | "Casa" | "PH" | "Otro";
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
  hasGarage?: boolean;
  amenities: PropertyAmenity[];
  description: string;
  image: string;
  gallery: string[];
  imagePaths?: string[];
  featured?: boolean;
  status?: "published" | "draft";
};

export type PropertyCardData = Pick<
  Property,
  | "slug"
  | "title"
  | "operation"
  | "type"
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
  property_type: Property["type"];
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
  has_garage: boolean;
  amenities: PropertyAmenity[];
  description: string;
  images: string[];
  featured: boolean;
  status: Property["status"];
};

type PropertyCardRow = Pick<
  PropertyRow,
  | "slug"
  | "title"
  | "operation"
  | "property_type"
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
    amenities: ["Balcón", "Parrilla", "Lavadero"],
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
    amenities: ["Aire acondicionado", "Lavadero"],
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
    amenities: ["Jardín", "Parrilla", "Pileta"],
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
    amenities: ["Terraza", "Lavadero"],
    description:
      "Un PH cálido que combina detalles de época con una puesta en valor actual y luminosa.",
    image: photo("photo-1771287491132-4954b32210d6"),
    gallery: [
      photo("photo-1771287491132-4954b32210d6"),
      photo("photo-1663756915301-2ba688e078cf"),
    ],
  },
];

function toProperty(row: PropertyRow, getImageUrl: (path: string) => string): Property {
  const gallery = (row.images ?? []).map((path) =>
    path.startsWith("http") ? path : getImageUrl(path),
  );
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    operation: row.operation,
    type: row.property_type,
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
    hasGarage: row.has_garage ?? false,
    amenities: row.amenities ?? [],
    description: row.description,
    gallery,
    imagePaths: row.images ?? [],
    image: gallery[0] ?? "",
    featured: row.featured,
    status: row.status,
  };
}

function toPropertyCardData(
  row: PropertyCardRow,
  getImageUrl: (path: string) => string,
): PropertyCardData {
  const imagePath = row.images?.[0] ?? "";
  return {
    slug: row.slug,
    title: row.title,
    operation: row.operation,
    type: row.property_type,
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
  operation?: string;
  type?: string;
  minimumRooms?: number;
  location?: string;
};

export async function getProperties(filters: PropertyFilters = {}): Promise<PropertyCardData[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    const properties = process.env.NODE_ENV === "production" ? [] : sampleProperties;
    return properties.map((property) => ({
      slug: property.slug,
      title: property.title,
      operation: property.operation,
      type: property.type,
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
        (!filters.operation || property.operation === filters.operation) &&
        (!filters.type || property.type === filters.type) &&
        (!location || propertyLocation.includes(location)) &&
        property.rooms >= (filters.minimumRooms || 0)
      );
    });
  }

  const supabase = createPublishedPropertiesClient(url, key);
  let query = supabase
    .from("properties")
    .select("slug,title,operation,property_type,neighborhood,city,street,street_number,price,expenses,currency,rooms,bathrooms,area,images,featured")
    .eq("status", "published");

  if (filters.operation) query = query.eq("operation", filters.operation);
  if (filters.type) query = query.eq("property_type", filters.type);
  if (filters.minimumRooms && Number.isFinite(filters.minimumRooms)) {
    query = query.gte("rooms", filters.minimumRooms);
  }
  const location = filters.location?.trim();
  if (location) {
    const pattern = `"%${escapeLikeFilter(location)}%"`;
    query = query.or(`neighborhood.ilike.${pattern},city.ilike.${pattern}`);
  }

  const { data } = await query.order("created_at", { ascending: false });

  return (data ?? []).map((row) => toPropertyCardData(
      row as PropertyCardRow,
      (path) => supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl,
    ));
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
    ? toProperty(data as PropertyRow, (path) => supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl)
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
    toProperty(row as PropertyRow, (path) => supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl),
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
