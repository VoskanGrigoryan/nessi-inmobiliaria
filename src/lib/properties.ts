import { cache } from "react";

export type Operation = "venta" | "alquiler";
export type Orientation = "Norte" | "Noreste" | "Este" | "Sudeste" | "Sur" | "Sudoeste" | "Oeste" | "Noroeste";
export type Disposition = "Frente" | "Contrafrente";

export type Property = {
  id?: string;
  slug: string;
  title: string;
  operation: Operation;
  type: "Departamento" | "Casa" | "PH";
  neighborhood: string;
  city: string;
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
  description: string;
  image: string;
  gallery: string[];
  imagePaths?: string[];
  featured?: boolean;
  status?: "published" | "draft";
};

type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  operation: Operation;
  property_type: Property["type"];
  neighborhood: string;
  city: string;
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
  description: string;
  images: string[];
  featured: boolean;
  status: Property["status"];
};

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

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
    description: row.description,
    gallery,
    imagePaths: row.images ?? [],
    image: gallery[0] ?? "",
    featured: row.featured,
    status: row.status,
  };
}

export async function getProperties() {
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return process.env.NODE_ENV === "production" ? [] : sampleProperties;
  }

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) =>
    toProperty(row as PropertyRow, (path) => supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl),
  );
}

export const getPropertyBySlug = cache(async (slug: string) => {
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return process.env.NODE_ENV === "production"
      ? undefined
      : sampleProperties.find((property) => property.slug === slug);
  }

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

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
    .select("*")
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

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/5491134823030?text=${encodeURIComponent(message)}`;
}
