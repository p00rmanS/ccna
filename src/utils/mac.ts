export interface MacInfo {
  /** 12 upper-case hex digits, no separators. */
  hex: string;
  bytes: number[];
  colon: string;
  dash: string;
  /** Cisco IOS style: three groups of four hex digits, lower case. */
  cisco: string;
  oui: string;
  nic: string;
  kind: 'broadcast' | 'multicast' | 'unicast';
  administration: 'universal' | 'local';
}

/** Accepts 00:1A:2B:3C:4D:5E, 00-1A-2B-3C-4D-5E, 001a.2b3c.4d5e or 001A2B3C4D5E. */
export function parseMac(text: string): MacInfo | null {
  const t = text.trim();
  const separators = [/^([0-9a-f]{2})([:-])(?:[0-9a-f]{2}\2){4}[0-9a-f]{2}$/i, /^[0-9a-f]{4}\.[0-9a-f]{4}\.[0-9a-f]{4}$/i, /^[0-9a-f]{12}$/i];
  if (!separators.some((re) => re.test(t))) return null;
  const hex = t.replace(/[^0-9a-f]/gi, '').toUpperCase();
  if (hex.length !== 12) return null;
  const bytes = hex.match(/../g)!.map((h) => parseInt(h, 16));
  const first = bytes[0]!;
  const kind = hex === 'FFFFFFFFFFFF' ? 'broadcast' : first & 1 ? 'multicast' : 'unicast';
  const pairs = hex.match(/../g)!;
  return {
    hex,
    bytes,
    colon: pairs.join(':'),
    dash: pairs.join('-'),
    cisco: hex.toLowerCase().match(/..../g)!.join('.'),
    oui: pairs.slice(0, 3).join(':'),
    nic: pairs.slice(3).join(':'),
    kind,
    administration: first & 2 ? 'local' : 'universal',
  };
}

/** Normalises any accepted spelling to the Cisco form used in `show mac address-table`. */
export function toCisco(text: string): string | null {
  return parseMac(text)?.cisco ?? null;
}

export function isGroupAddress(text: string): boolean {
  const info = parseMac(text);
  return info !== null && info.kind !== 'unicast';
}
