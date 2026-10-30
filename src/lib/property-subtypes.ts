export const propertySubtypes = [
  "Aparestudio",
  "Dúplex",
  "Estándar",
  "Loft",
  "Monoambiente",
  "Penthouse",
  "Piso",
  "Semipiso",
  "Tríplex",
] as const;

export type PropertySubtype = (typeof propertySubtypes)[number];
