import { describe, expect, it } from 'vitest';
import { additionBreakdown, andOctets, bitsToNumber, fromBinary, numberToBits, toBinary8 } from './binary';

describe('binary', () => {
  it('converts the values used in the lessons', () => {
    const known: Array<[number, string]> = [
      [0, '00000000'], [1, '00000001'], [10, '00001010'], [128, '10000000'], [168, '10101000'], [172, '10101100'],
      [192, '11000000'], [224, '11100000'], [240, '11110000'], [248, '11111000'], [252, '11111100'], [255, '11111111'],
    ];
    for (const [n, bits] of known) {
      expect(toBinary8(n)).toBe(bits);
      expect(fromBinary(bits)).toBe(n);
    }
  });
  it('round-trips every octet', () => {
    for (let n = 0; n <= 255; n++) {
      expect(fromBinary(toBinary8(n))).toBe(n);
      expect(bitsToNumber(numberToBits(n))).toBe(n);
    }
  });
  it('rejects values outside one octet and bad input', () => {
    expect(() => toBinary8(256)).toThrow();
    expect(() => toBinary8(-1)).toThrow();
    expect(fromBinary('')).toBeNull();
    expect(fromBinary('12')).toBeNull();
    expect(fromBinary('111111111')).toBeNull();
    expect(fromBinary('1010 1100')).toBe(172);
  });
  it('explains a number as a sum of place values', () => {
    expect(additionBreakdown(172)).toBe('128 + 32 + 8 + 4');
    expect(additionBreakdown(0)).toBe('0');
    expect(additionBreakdown(255)).toBe('128 + 64 + 32 + 16 + 8 + 4 + 2 + 1');
  });
  it('performs the mask AND used in subnetting', () => {
    expect(andOctets(130, 128)).toBe(128);
    expect(andOctets(100, 192)).toBe(64);
  });
});
