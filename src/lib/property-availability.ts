export const propertyAvailabilityStatuses = ["available", "reserved", "sold", "rented"] as const;

export type PropertyAvailabilityStatus = (typeof propertyAvailabilityStatuses)[number];

export const propertyAvailabilityLabels: Record<PropertyAvailabilityStatus, string> = {
  available: "Disponible",
  reserved: "Reservada",
  sold: "Vendida",
  rented: "Alquilada",
};
