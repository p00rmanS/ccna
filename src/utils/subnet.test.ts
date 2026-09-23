import { describe, expect, it } from 'vitest';
import {
  broadcastAddress, checkAnswer, classifyIp, describeSubnet, firstHost, generateQuestion, intToIp, lastHost, maskToPrefix,
  mulberry32, networkAddress, parseAddressAndMask, parseCidr, parseIp, prefixBucket, prefixToInt, prefixToMask,
  sameSubnet, toBinaryOctets, usableHostCount, type Level,
} from './subnet';

const ip = (s: string) => parseIp(s)!;

describe('parsing', () => {
  it('parses and formats dotted decimal', () => {
    expect(intToIp(ip('192.168.1.10'))).toBe('192.168.1.10');
    expect(ip('255.255.255.255')).toBe(4294967295);
    expect(ip('0.0.0.0')).toBe(0);
  });
  it('rejects malformed addresses', () => {
    for (const bad of ['', '1.2.3', '1.2.3.4.5', '256.1.1.1', '1.2.3.-4', 'a.b.c.d', '1.2.3.4/24']) {
      expect(parseIp(bad)).toBeNull();
    }
  });
  it('parses CIDR and address+mask forms', () => {
    expect(parseCidr('10.0.0.1/8')).toEqual({ ip: ip('10.0.0.1'), prefix: 8 });
    expect(parseCidr('10.0.0.1/33')).toBeNull();
    expect(parseAddressAndMask('10.1.2.3 255.255.0.0')).toEqual({ ip: ip('10.1.2.3'), prefix: 16 });
    expect(parseAddressAndMask('10.1.2.3 255.0.255.0')).toBeNull();
  });
});

describe('masks and prefixes', () => {
  it('round-trips every prefix from 0 to 32', () => {
    for (let p = 0; p <= 32; p++) expect(maskToPrefix(prefixToMask(p))).toBe(p);
  });
  it('knows the common masks', () => {
    expect(prefixToMask(24)).toBe('255.255.255.0');
    expect(prefixToMask(25)).toBe('255.255.255.128');
    expect(prefixToMask(30)).toBe('255.255.255.252');
    expect(prefixToMask(0)).toBe('0.0.0.0');
    expect(prefixToMask(32)).toBe('255.255.255.255');
    expect(prefixToInt(1)).toBe(0x80000000);
  });
  it('rejects non-contiguous masks', () => {
    for (const bad of ['255.0.255.0', '255.255.255.1', '0.255.0.0', '255.254.255.0']) expect(maskToPrefix(bad)).toBeNull();
  });
  it('throws on an invalid prefix', () => {
    expect(() => prefixToInt(33)).toThrow();
    expect(() => prefixToInt(-1)).toThrow();
  });
});

describe('subnet facts', () => {
  it('192.168.50.130/25 (the worked example)', () => {
    const f = describeSubnet(ip('192.168.50.130'), 25);
    expect(f.network).toBe('192.168.50.128');
    expect(f.broadcast).toBe('192.168.50.255');
    expect(f.firstHost).toBe('192.168.50.129');
    expect(f.lastHost).toBe('192.168.50.254');
    expect(f.usableHosts).toBe(126);
    expect(f.wildcard).toBe('0.0.0.127');
  });
  it('172.16.35.77/20', () => {
    const f = describeSubnet(ip('172.16.35.77'), 20);
    expect(f.network).toBe('172.16.32.0');
    expect(f.broadcast).toBe('172.16.47.255');
    expect(f.usableHosts).toBe(4094);
  });
  it('matches the PROJECT.md subnet table', () => {
    const table: Array<[number, string, number, number]> = [
      [24, '255.255.255.0', 256, 254], [25, '255.255.255.128', 128, 126], [26, '255.255.255.192', 64, 62],
      [27, '255.255.255.224', 32, 30], [28, '255.255.255.240', 16, 14], [29, '255.255.255.248', 8, 6], [30, '255.255.255.252', 4, 2],
    ];
    for (const [p, mask, total, usable] of table) {
      const f = describeSubnet(ip('10.0.0.0'), p);
      expect([f.mask, f.totalAddresses, f.usableHosts]).toEqual([mask, total, usable]);
    }
  });
  it('counts hosts for large and tiny subnets', () => {
    expect(usableHostCount(22)).toBe(1022);
    expect(usableHostCount(8)).toBe(16777214);
    expect(usableHostCount(31)).toBe(2);
    expect(usableHostCount(32)).toBe(1);
  });
  it('handles /31 and /32 host ranges', () => {
    expect(intToIp(firstHost(ip('10.0.0.4'), 31))).toBe('10.0.0.4');
    expect(intToIp(lastHost(ip('10.0.0.4'), 31))).toBe('10.0.0.5');
    expect(intToIp(firstHost(ip('10.0.0.9'), 32))).toBe('10.0.0.9');
    expect(intToIp(lastHost(ip('10.0.0.9'), 32))).toBe('10.0.0.9');
  });
  it('handles /0 and the top of the address space', () => {
    expect(intToIp(networkAddress(ip('200.1.2.3'), 0))).toBe('0.0.0.0');
    expect(intToIp(broadcastAddress(ip('200.1.2.3'), 0))).toBe('255.255.255.255');
    expect(intToIp(broadcastAddress(ip('255.255.255.255'), 24))).toBe('255.255.255.255');
  });
});

describe('sameSubnet', () => {
  it('compares network portions', () => {
    expect(sameSubnet(ip('10.1.1.100'), ip('10.1.1.20'), 25)).toBe(true);
    expect(sameSubnet(ip('10.1.1.200'), ip('10.1.1.100'), 25)).toBe(false);
    expect(sameSubnet(ip('192.168.1.10'), ip('192.168.2.10'), 24)).toBe(false);
    expect(sameSubnet(ip('192.168.0.10'), ip('192.168.1.10'), 23)).toBe(true);
    expect(sameSubnet(ip('192.168.1.10'), ip('192.168.2.10'), 23)).toBe(false);
  });
});

describe('classification', () => {
  it('labels special and private ranges', () => {
    expect(classifyIp(ip('10.9.9.9'))).toMatch(/Private/);
    expect(classifyIp(ip('172.31.255.254'))).toMatch(/Private/);
    expect(classifyIp(ip('172.32.0.1'))).toMatch(/Public/);
    expect(classifyIp(ip('172.15.0.1'))).toMatch(/Public/);
    expect(classifyIp(ip('192.168.0.1'))).toMatch(/Private/);
    expect(classifyIp(ip('127.0.0.1'))).toMatch(/Loopback/);
    expect(classifyIp(ip('169.254.10.1'))).toMatch(/APIPA/);
    expect(classifyIp(ip('224.0.0.5'))).toMatch(/Multicast/);
    expect(classifyIp(ip('8.8.8.8'))).toMatch(/Public/);
  });
  it('produces binary octets', () => {
    expect(toBinaryOctets(ip('192.168.1.10'))).toEqual(['11000000', '10101000', '00000001', '00001010']);
  });
  it('buckets prefixes', () => {
    expect([prefixBucket(8), prefixBucket(16), prefixBucket(24), prefixBucket(27)]).toEqual(['/8–/15', '/16–/23', '/24', '/25–/30']);
  });
});

/** Independent implementation using the "block size" shortcut, to cross-check the bitwise code. */
function networkByBlockSize(addr: string, prefix: number): string {
  const octets = addr.split('.').map(Number);
  const out = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    const bitsInOctet = Math.max(0, Math.min(8, prefix - 8 * i));
    if (bitsInOctet === 8) out[i] = octets[i]!;
    else if (bitsInOctet === 0) out[i] = 0;
    else {
      const block = 2 ** (8 - bitsInOctet);
      out[i] = Math.floor(octets[i]! / block) * block;
    }
  }
  return out.join('.');
}

describe('generator', () => {
  it('always produces answers that agree with an independent calculation', () => {
    const rng = mulberry32(12345);
    for (const level of [1, 2, 3, 4] as Level[]) {
      for (let i = 0; i < 1500; i++) {
        const q = generateQuestion(level, rng);
        expect(q.steps.length).toBeGreaterThan(0);
        if (q.kind === 'network') expect(q.expected).toBe(networkByBlockSize(q.ip, q.prefix));
        if (q.kind === 'broadcast') {
          const net = ip(networkByBlockSize(q.ip, q.prefix));
          expect(ip(q.expected)).toBe(net + 2 ** (32 - q.prefix) - 1);
        }
        if (q.kind === 'first-host') expect(ip(q.expected)).toBe(ip(networkByBlockSize(q.ip, q.prefix)) + 1);
        if (q.kind === 'last-host') expect(ip(q.expected)).toBe(ip(networkByBlockSize(q.ip, q.prefix)) + 2 ** (32 - q.prefix) - 2);
        if (q.kind === 'host-count') expect(Number(q.expected)).toBe(2 ** (32 - q.prefix) - 2);
        if (q.kind === 'same-subnet') {
          const same = networkByBlockSize(q.ip, q.prefix) === networkByBlockSize(q.ip2!, q.prefix);
          expect(q.expected).toBe(same ? 'yes' : 'no');
        }
        if (q.kind === 'mask') expect(maskToPrefix(q.expected)).toBe(q.prefix);
        expect(checkAnswer(q, q.expected)).toBe(true);
      }
    }
  });
  it('respects the prefix range of each level', () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 300; i++) {
      expect([8, 16, 24]).toContain(generateQuestion(1, rng).prefix);
      const p2 = generateQuestion(2, rng).prefix;
      expect(p2).toBeGreaterThanOrEqual(25);
      expect(p2).toBeLessThanOrEqual(30);
    }
  });
  it('produces both yes and no answers for same-subnet questions', () => {
    const rng = mulberry32(99);
    const answers = new Set<string>();
    for (let i = 0; i < 200; i++) answers.add(generateQuestion(2, rng, ['same-subnet']).expected);
    expect(answers).toEqual(new Set(['yes', 'no']));
  });
  it('is deterministic for a given seed', () => {
    const a = generateQuestion(4, mulberry32(5));
    const b = generateQuestion(4, mulberry32(5));
    expect(a).toEqual(b);
  });
});

describe('checkAnswer', () => {
  const base = { level: 1 as Level, ip: '10.0.0.0', prefix: 24, steps: [], prompt: '' };
  it('accepts equivalent spellings', () => {
    expect(checkAnswer({ ...base, kind: 'network', answerType: 'ip', expected: '10.0.0.0' }, ' 10.0.0.0 ')).toBe(true);
    expect(checkAnswer({ ...base, kind: 'network', answerType: 'ip', expected: '10.0.0.0' }, '10.0.0.1')).toBe(false);
    expect(checkAnswer({ ...base, kind: 'host-count', answerType: 'number', expected: '1022' }, '1,022')).toBe(true);
    expect(checkAnswer({ ...base, kind: 'prefix', answerType: 'prefix', expected: '26' }, '/26')).toBe(true);
    expect(checkAnswer({ ...base, kind: 'prefix', answerType: 'prefix', expected: '26' }, '26')).toBe(true);
    expect(checkAnswer({ ...base, kind: 'same-subnet', answerType: 'yesno', expected: 'yes' }, 'Y')).toBe(true);
    expect(checkAnswer({ ...base, kind: 'same-subnet', answerType: 'yesno', expected: 'no' }, 'yes')).toBe(false);
  });
});
