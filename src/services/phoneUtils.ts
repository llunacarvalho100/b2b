export function cleanPhoneDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function formatDisplayPhone(raw: string): string {
  const digits = cleanPhoneDigits(raw);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 13 && digits.startsWith('55')) {
    return `+55 (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  return raw;
}

export function extractWhatsAppNumber(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = cleanPhoneDigits(raw);
  if (digits.length === 11) {
    return `55${digits}`;
  }
  if (digits.length === 10) {
    return `55${digits}`;
  }
  if (digits.length === 12 || digits.length === 13) {
    return digits;
  }
  return digits.length >= 8 ? digits : null;
}

export function buildWhatsAppUrl(
  phone: string | null,
  initialMessage: string
): string | null {
  const waNumber = extractWhatsAppNumber(phone);
  if (!waNumber) return null;
  const encoded = encodeURIComponent(initialMessage);
  return `https://wa.me/${waNumber}?text=${encoded}`;
}
