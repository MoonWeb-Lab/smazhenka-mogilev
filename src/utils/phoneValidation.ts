export function isValidBelarusPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('375')) return digits.length === 12;
  if (digits.startsWith('80')) return digits.length === 11;
  return digits.length >= 9 && digits.length <= 12;
}

export function getRussianPlural(n: number, forms: [string, string, string]): string {
  const absN = Math.abs(n) % 100;
  const n1 = absN % 10;
  if (absN > 10 && absN < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}
