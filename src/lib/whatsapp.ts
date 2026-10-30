export function getWhatsAppUrl(message: string) {
  return `https://wa.me/5491134823030?text=${encodeURIComponent(message)}`;
}
