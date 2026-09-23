import { describe, expect, it } from 'vitest';
import { classifyIpv6, compressIpv6, expandIpv6, macToEui64, parseIpv6 } from './ipv6';

const p = (s: string) => parseIpv6(s)!;

describe('parseIpv6', () => {
  it('parses full and compressed forms to the same groups', () => {
    expect(p('2001:0db8:0000:0000:0000:ff00:0042:8329')).toEqual([0x2001, 0xdb8, 0, 0, 0, 0xff00, 0x42, 0x8329]);
    expect(p('2001:db8::ff00:42:8329')).toEqual(p('2001:0db8:0000:0000:0000:ff00:0042:8329'));
    expect(p('::')).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    expect(p('::1')).toEqual([0, 0, 0, 0, 0, 0, 0, 1]);
    expect(p('fe80::')).toEqual([0xfe80, 0, 0, 0, 0, 0, 0, 0]);
    expect(p('FE80::ABCD')).toEqual([0xfe80, 0, 0, 0, 0, 0, 0, 0xabcd]);
  });
  it('rejects invalid text', () => {
    for (const bad of ['', ':::', '1::2::3', '1:2:3:4:5:6:7', '1:2:3:4:5:6:7:8:9', 'g::1', '12345::1', '1:2:3:4:5:6:7::8', ':1:2:3:4:5:6:7', '2001:db8', '::1::']) {
      expect(parseIpv6(bad)).toBeNull();
    }
  });
});

describe('expand and compress', () => {
  it('matches the worked example from the course', () => {
    const g = p('2001:0db8:0000:0000:0000:ff00:0042:8329');
    expect(compressIpv6(g)).toBe('2001:db8::ff00:42:8329');
    expect(expandIpv6(p('2001:db8::ff00:42:8329'))).toBe('2001:0db8:0000:0000:0000:ff00:0042:8329');
  });
  it('compresses the LONGEST zero run and the first on a tie', () => {
    expect(compressIpv6(p('2001:db8:0:0:1:0:0:1'))).toBe('2001:db8::1:0:0:1');
    expect(compressIpv6(p('2001:0:0:1:0:0:0:1'))).toBe('2001:0:0:1::1');
  });
  it('never compresses a single zero group', () => {
    expect(compressIpv6(p('2001:db8:0:1:1:1:1:1'))).toBe('2001:db8:0:1:1:1:1:1');
  });
  it('handles all-zero, loopback and edge runs', () => {
    expect(compressIpv6(p('0:0:0:0:0:0:0:0'))).toBe('::');
    expect(compressIpv6(p('0:0:0:0:0:0:0:1'))).toBe('::1');
    expect(compressIpv6(p('fe80:0:0:0:0:0:0:0'))).toBe('fe80::');
  });
  it('round-trips random addresses', () => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 2000; i++) {
      const g = Array.from({ length: 8 }, () => (rnd() < 0.4 ? 0 : Math.floor(rnd() * 65536)));
      expect(parseIpv6(compressIpv6(g))).toEqual(g);
      expect(parseIpv6(expandIpv6(g))).toEqual(g);
    }
  });
});

describe('classifyIpv6', () => {
  it('recognises the address types taught in the lesson', () => {
    const type = (s: string) => classifyIpv6(p(s)).type;
    expect(type('::')).toBe('unspecified');
    expect(type('::1')).toBe('loopback');
    expect(type('fe80::1')).toBe('link-local');
    expect(type('febf::1')).toBe('link-local');
    expect(type('fec0::1')).toBe('other');
    expect(type('fc00::1')).toBe('unique-local');
    expect(type('fd12:3456:789a::1')).toBe('unique-local');
    expect(type('2001:db8::1')).toBe('global-unicast');
    expect(type('3fff::1')).toBe('global-unicast');
    expect(type('4000::1')).toBe('other');
    expect(type('ff02::1')).toBe('multicast');
  });
  it('names well-known multicast groups and scopes', () => {
    expect(classifyIpv6(p('ff02::2')).detail).toMatch(/All routers/);
    expect(classifyIpv6(p('ff02::5')).detail).toMatch(/OSPFv3/);
    expect(classifyIpv6(p('ff02::1:ff3c:4d5e')).detail).toMatch(/Solicited-node/);
    expect(classifyIpv6(p('ff0e::1')).detail).toMatch(/global/);
  });
  it('flags the documentation prefix', () => {
    expect(classifyIpv6(p('2001:db8:1::1')).detail).toMatch(/documentation/);
  });
});

describe('macToEui64', () => {
  it('inserts FFFE and flips the universal/local bit', () => {
    const r = macToEui64('00:1A:2B:3C:4D:5E')!;
    expect(r.groups).toEqual([0x021a, 0x2bff, 0xfe3c, 0x4d5e]);
    expect(r.linkLocal).toBe('fe80::21a:2bff:fe3c:4d5e');
  });
  it('flips the bit back when it was already 1', () => {
    expect(macToEui64('02:1A:2B:3C:4D:5E')!.groups[0]).toBe(0x001a);
  });
  it('works for a MAC that starts with 5C', () => {
    expect(macToEui64('5C-26-0A-12-34-56')!.linkLocal).toBe('fe80::5e26:aff:fe12:3456');
  });
  it('rejects a bad MAC', () => {
    expect(macToEui64('nope')).toBeNull();
  });
});
