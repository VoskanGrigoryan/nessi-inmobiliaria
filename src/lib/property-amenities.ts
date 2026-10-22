export const propertyAmenities = [
  "Balcón",
  "Terraza",
  "Patio",
  "Jardín",
  "Lavadero",
  "Parrilla",
  "Pileta",
  "SUM",
  "Gimnasio",
  "Ascensor",
  "Aire acondicionado",
  "Calefacción",
  "Seguridad 24 hs",
] as const;

export type PropertyAmenity = (typeof propertyAmenities)[number];
