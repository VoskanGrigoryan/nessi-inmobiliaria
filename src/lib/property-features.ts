export const propertyFeatures = [
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
  "Laundry",
] as const;

export type PropertyFeature = (typeof propertyFeatures)[number];
