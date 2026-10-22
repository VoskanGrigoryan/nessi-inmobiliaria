export const propertyLocations = {
  CABA: [
    "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", "Chacarita",
    "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Boca", "La Paternal", "Liniers",
    "Mataderos", "Monte Castro", "Monserrat", "Nueva Pompeya", "Núñez", "Palermo", "Parque Avellaneda",
    "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero", "Recoleta", "Retiro",
    "Saavedra", "San Cristóbal", "San Nicolás", "San Telmo", "Vélez Sarsfield", "Versalles", "Villa Crespo",
    "Villa Devoto", "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón",
    "Villa Real", "Villa Riachuelo", "Villa Santa Rita", "Villa Soldati", "Villa Urquiza", "Villa del Parque",
  ],
  "Provincia de Buenos Aires": [
    "9 de Julio", "Adrogué", "Azul", "Bahía Blanca", "Balcarce", "Banfield", "Baradero", "Beccar", "Bella Vista",
    "Benavídez", "Berazategui", "Bernal", "Boulogne", "Bragado", "Burzaco", "Campana", "Cañuelas", "Carapachay", "Caseros",
    "Castelar", "Chacabuco", "Chascomús", "Chivilcoy", "Ciudad Evita", "Ciudadela", "Coronel Suárez", "Don Torcuato",
    "Dolores", "El Palomar", "El Talar", "Ezeiza", "Florencio Varela", "Florida", "Garín", "General Rodríguez",
    "General Pacheco", "General Villegas", "Haedo", "Hurlingham", "Ingeniero Maschwitz", "Isidro Casanova", "Ituzaingó",
    "Junín", "José León Suárez", "La Plata", "La Lucila", "Lanús", "Las Flores", "Lincoln", "Lomas de Zamora",
    "Longchamps", "Luján", "Magdalena", "Mar del Plata", "Martínez", "Mercedes", "Merlo", "Monte Grande", "Moreno", "Morón",
    "Munro", "Navarro", "Necochea", "Olavarría", "Olivos", "Pergamino", "Pilar", "Pinamar", "Punta Alta", "Quilmes",
    "Ramos Mejía", "Rauch", "Remedios de Escalada", "Saladillo", "San Antonio de Areco", "San Fernando", "San Isidro",
    "San Justo", "San Martín", "San Miguel", "San Nicolás de los Arroyos", "Santos Lugares", "Tandil", "Temperley", "Tigre",
    "Trenque Lauquen", "Tristán Suárez", "Tres Arroyos", "Valentín Alsina", "Victoria", "Villa Ballester", "Villa Domínico",
    "Villa Gesell", "Villa Martelli", "Wilde", "Zárate",
  ],
} as const;

export type PropertyCity = keyof typeof propertyLocations;

export function isPropertyCity(city: string): city is PropertyCity {
  return Object.hasOwn(propertyLocations, city);
}

export function isPropertyLocation(city: string, neighborhood: string) {
  return isPropertyCity(city) && (propertyLocations[city] as readonly string[]).includes(neighborhood);
}
