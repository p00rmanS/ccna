import { describe, expect, it } from 'vitest';
import { isGroupAddress, parseMac, toCisco } from './mac';

describe('parseMac', () => {
  it('parses every common spelling to the same address', () => {
    const forms = ['00:1A:2B:3C:4D:5E', '00-1a-2b-3c-4d-5e', '001a.2b3c.4d5e', '001A2B3C4D5E'];
    for (const f of forms) expect(parseMac(f)?.hex).toBe('001A2B3C4D5E');
  });
  it('splits the OUI from the NIC-specific half', () => {
    const m = parseMac('00:1A:2B:3C:4D:5E')!;
    expect(m.oui).toBe('00:1A:2B');
    expect(m.nic).toBe('3C:4D:5E');
    expect(m.cisco).toBe('001a.2b3c.4d5e');
    expect(m.dash).toBe('00-1A-2B-3C-4D-5E');
  });
  it('classifies unicast, multicast and broadcast by the lowest bit of the first byte', () => {
    expect(parseMac('00:1A:2B:3C:4D:5E')!.kind).toBe('unicast');
    expect(parseMac('FF:FF:FF:FF:FF:FF')!.kind).toBe('broadcast');
    expect(parseMac('01:00:5E:00:00:05')!.kind).toBe('multicast');
    expect(parseMac('33:33:00:00:00:01')!.kind).toBe('multicast');
    expect(parseMac('02:00:00:00:00:01')!.kind).toBe('unicast');
  });
  it('reads the universal/local bit', () => {
    expect(parseMac('00:1A:2B:3C:4D:5E')!.administration).toBe('universal');
    expect(parseMac('02:1A:2B:3C:4D:5E')!.administration).toBe('local');
  });
  it('rejects malformed input', () => {
    for (const bad of ['', 'G0:1A:2B:3C:4D:5E', '00:1A:2B:3C:4D', '00:1A:2B:3C:4D:5E:6F', '00:1A-2B:3C-4D:5E', '001a.2b3c', '12345']) {
      expect(parseMac(bad)).toBeNull();
    }
  });
  it('helpers', () => {
    expect(toCisco('00-1A-2B-3C-4D-5E')).toBe('001a.2b3c.4d5e');
    expect(toCisco('nope')).toBeNull();
    expect(isGroupAddress('ffff.ffff.ffff')).toBe(true);
    expect(isGroupAddress('001a.2b3c.4d5e')).toBe(false);
  });
});
