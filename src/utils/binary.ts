/** Place values of an 8-bit octet, left to right. */
export const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1] as const;

export function toBinary8(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 255) throw new RangeError(`${n} does not fit in one octet`);
  return n.toString(2).padStart(8, '0');
}

/** Parses 1–8 binary digits (spaces allowed). Returns null for anything else. */
export function fromBinary(text: string): number | null {
  const clean = text.replace(/\s+/g, '');
  if (!/^[01]{1,8}$/.test(clean)) return null;
  return parseInt(clean, 2);
}

export function bitsToNumber(bits: readonly boolean[]): number {
  return bits.reduce((sum, on, i) => sum + (on ? BIT_VALUES[i]! : 0), 0);
}

export function numberToBits(n: number): boolean[] {
  return toBinary8(n).split('').map((c) => c === '1');
}

/** Shows which place values add up to the number, e.g. 172 -> "128 + 32 + 8 + 4". */
export function additionBreakdown(n: number): string {
  const bits = numberToBits(n);
  const parts = BIT_VALUES.filter((_, i) => bits[i]);
  return parts.length ? parts.join(' + ') : '0';
}

/** Bitwise AND of two octets written out in binary — the operation a subnet mask performs. */
export function andOctets(a: number, b: number): number {
  return a & b;
}
