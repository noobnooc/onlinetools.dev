import { type ToolResult, ok, err } from './types';

export type IpVersion = 4 | 6;

export interface IpScope {
	name: string;
	/** Where the range is defined, e.g. "RFC 1918". Empty for plain public space. */
	ref: string;
}

export interface CidrBlock {
	kind: 'block';
	version: IpVersion;
	prefix: number;
	/** The address as typed, normalized. */
	address: string;
	network: string;
	/** Broadcast for IPv4, the last address of the block for IPv6. */
	last: string;
	firstHost: string;
	lastHost: string;
	/** IPv4 only — IPv6 has no netmask notation in practice. */
	netmask?: string;
	wildcard?: string;
	/** Exact counts as decimal strings: a /0 IPv6 block has 2¹²⁸ addresses. */
	total: string;
	usable: string;
	/** The typed address isn't the network address (e.g. 10.0.0.5/24). */
	hostBitsSet: boolean;
	scope: IpScope;
	/** IPv6 with every group written out, for logs and firewall configs that need it. */
	expanded?: string;
	/** The address as one unsigned integer. */
	integer: string;
	hex: string;
	/** The address in binary, octets/groups separated, for seeing where the prefix cuts. */
	binary: string;
	/** Reverse-DNS (PTR) name of the typed address. */
	reverse: string;
}

export interface CidrRange {
	kind: 'range';
	version: IpVersion;
	start: string;
	end: string;
	total: string;
	/** The smallest list of CIDR blocks that covers start..end exactly. */
	cidrs: string[];
}

export type CidrAnalysis = CidrBlock | CidrRange;

const BITS: Record<IpVersion, number> = { 4: 32, 6: 128 };

/**
 * Strict dotted-quad parser. Leading zeros are rejected rather than guessed
 * at: inet_aton reads "010" as octal 8, most other parsers read it as 10, and
 * a calculator silently picking one is how firewall rules end up wrong.
 */
export function parseIPv4(s: string): ToolResult<bigint> {
	const parts = s.split('.');
	if (parts.length !== 4) return err(`"${s}" is not an IPv4 address — expected four numbers separated by dots`);
	let n = 0n;
	for (const p of parts) {
		if (!/^\d{1,3}$/.test(p)) return err(`"${p}" in ${s} is not a number from 0 to 255`);
		if (p.length > 1 && p.startsWith('0'))
			return err(`"${p}" in ${s} has a leading zero, which some systems read as octal — write ${Number(p)}`);
		const v = Number(p);
		if (v > 255) return err(`${v} in ${s} is out of range — each part must be 0 to 255`);
		n = (n << 8n) | BigInt(v);
	}
	return ok(n);
}

export function parseIPv6(s: string): ToolResult<bigint> {
	if (s.includes('%')) return err(`Remove the zone index ("${s.slice(s.indexOf('%'))}") — it is local to one machine and not part of the address`);
	let text = s.toLowerCase();
	// An embedded IPv4 tail (::ffff:192.0.2.1) stands for the last two groups.
	let tail: bigint | null = null;
	const dot = text.lastIndexOf('.');
	if (dot !== -1) {
		const colon = text.lastIndexOf(':');
		if (colon === -1 || colon > dot) return err(`"${s}" is not a valid IPv6 address`);
		const v4 = parseIPv4(text.slice(colon + 1));
		if (!v4.ok) return err(`The IPv4 part of ${s} is invalid: ${v4.error}`);
		tail = v4.value;
		text = text.slice(0, colon + 1) + '0:0';
	}
	const halves = text.split('::');
	if (halves.length > 2) return err(`"${s}" uses "::" more than once — it may only appear once`);
	const groups = (h: string) => (h === '' ? [] : h.split(':'));
	const head = groups(halves[0]);
	const rest = halves.length === 2 ? groups(halves[1]) : [];
	const all = halves.length === 2 ? head.length + rest.length : head.length;
	if (halves.length === 1 && all !== 8) return err(`"${s}" has ${all} groups — a full IPv6 address has 8 (use "::" to skip zeros)`);
	if (halves.length === 2 && all > 7) return err(`"${s}" has too many groups to use "::"`);
	const filled = halves.length === 2 ? [...head, ...Array(8 - all).fill('0'), ...rest] : head;
	let n = 0n;
	for (const g of filled) {
		if (!/^[0-9a-f]{1,4}$/.test(g)) return err(`"${g}" in ${s} is not a hex group of 1–4 digits`);
		n = (n << 16n) | BigInt(parseInt(g, 16));
	}
	if (tail !== null) n = (n & ~0xffffffffn) | tail;
	return ok(n);
}

export function formatIPv4(n: bigint): string {
	return [24n, 16n, 8n, 0n].map((s) => ((n >> s) & 255n).toString()).join('.');
}

function ipv6Groups(n: bigint): number[] {
	const out: number[] = [];
	for (let i = 7; i >= 0; i--) out.push(Number((n >> BigInt(i * 16)) & 0xffffn));
	return out;
}

/** RFC 5952 canonical form: lowercase, longest zero run (≥ 2 groups, first on ties) as "::". */
export function formatIPv6(n: bigint): string {
	const g = ipv6Groups(n);
	let best = -1;
	let bestLen = 1;
	for (let i = 0; i < 8; ) {
		if (g[i] !== 0) {
			i++;
			continue;
		}
		let j = i;
		while (j < 8 && g[j] === 0) j++;
		if (j - i > bestLen) {
			best = i;
			bestLen = j - i;
		}
		i = j;
	}
	const hex = g.map((x) => x.toString(16));
	if (best === -1) return hex.join(':');
	return `${hex.slice(0, best).join(':')}::${hex.slice(best + bestLen).join(':')}`;
}

export function expandIPv6(n: bigint): string {
	return ipv6Groups(n)
		.map((x) => x.toString(16).padStart(4, '0'))
		.join(':');
}

function formatIp(n: bigint, v: IpVersion): string {
	return v === 4 ? formatIPv4(n) : formatIPv6(n);
}

function parseIp(s: string): ToolResult<{ value: bigint; version: IpVersion }> {
	const r = s.includes(':') ? parseIPv6(s) : parseIPv4(s);
	if (!r.ok) return err(r.error);
	return ok({ value: r.value, version: s.includes(':') ? 6 : 4 });
}

function maskOf(prefix: number, v: IpVersion): bigint {
	const bits = BigInt(BITS[v]);
	const all = (1n << bits) - 1n;
	return (all << (bits - BigInt(prefix))) & all;
}

/** Netmask → prefix length, or null if the mask isn't a contiguous run of ones. */
export function maskToPrefix(mask: bigint): number | null {
	const inv = ~mask & 0xffffffffn;
	if ((inv & (inv + 1n)) !== 0n) return null;
	return 32 - inv.toString(2).replace(/^0+/, '').length;
}

interface ScopeRule {
	net: bigint;
	prefix: number;
	scope: IpScope;
}

function rule(cidr: string, name: string, ref: string): ScopeRule {
	const [addr, p] = cidr.split('/');
	const parsed = parseIp(addr);
	if (!parsed.ok) throw new Error(cidr);
	return { net: parsed.value.value, prefix: Number(p), scope: { name, ref } };
}

// Most specific first; the first containing rule wins. IANA special-purpose
// registries (RFC 6890 and successors), trimmed to ranges people actually meet.
const V4_SCOPES: ScopeRule[] = [
	rule('255.255.255.255/32', 'Limited broadcast', 'RFC 919'),
	rule('192.0.0.0/24', 'IETF protocol assignments', 'RFC 6890'),
	rule('192.0.2.0/24', 'Documentation (TEST-NET-1)', 'RFC 5737'),
	rule('198.51.100.0/24', 'Documentation (TEST-NET-2)', 'RFC 5737'),
	rule('203.0.113.0/24', 'Documentation (TEST-NET-3)', 'RFC 5737'),
	rule('192.88.99.0/24', '6to4 relay anycast (deprecated)', 'RFC 7526'),
	rule('198.18.0.0/15', 'Benchmarking', 'RFC 2544'),
	rule('169.254.0.0/16', 'Link-local', 'RFC 3927'),
	rule('192.168.0.0/16', 'Private', 'RFC 1918'),
	rule('172.16.0.0/12', 'Private', 'RFC 1918'),
	rule('100.64.0.0/10', 'Carrier-grade NAT (shared address space)', 'RFC 6598'),
	rule('10.0.0.0/8', 'Private', 'RFC 1918'),
	rule('127.0.0.0/8', 'Loopback', 'RFC 1122'),
	rule('0.0.0.0/8', '"This network"', 'RFC 1122'),
	rule('224.0.0.0/4', 'Multicast', 'RFC 5771'),
	rule('240.0.0.0/4', 'Reserved', 'RFC 1112')
];

const V6_SCOPES: ScopeRule[] = [
	rule('::/128', 'Unspecified', 'RFC 4291'),
	rule('::1/128', 'Loopback', 'RFC 4291'),
	rule('::ffff:0:0/96', 'IPv4-mapped', 'RFC 4291'),
	rule('64:ff9b::/96', 'NAT64 well-known prefix', 'RFC 6052'),
	rule('2001:db8::/32', 'Documentation', 'RFC 3849'),
	rule('2001::/32', 'Teredo', 'RFC 4380'),
	rule('2002::/16', '6to4', 'RFC 3056'),
	rule('fe80::/10', 'Link-local', 'RFC 4291'),
	rule('fc00::/7', 'Unique local (private)', 'RFC 4193'),
	rule('ff00::/8', 'Multicast', 'RFC 4291'),
	rule('2000::/3', 'Global unicast', 'RFC 4291')
];

/** The special-purpose range a block falls in; the block must fit inside the range entirely. */
export function scopeOf(network: bigint, prefix: number, v: IpVersion): IpScope {
	for (const r of v === 4 ? V4_SCOPES : V6_SCOPES) {
		if (prefix < r.prefix) continue;
		if ((network & maskOf(r.prefix, v)) === r.net) return r.scope;
	}
	if (v === 4) return { name: prefix === 0 ? 'Entire IPv4 space' : 'Public', ref: '' };
	return { name: prefix < 3 ? 'Mixed' : 'Reserved', ref: '' };
}

function binaryOf(n: bigint, v: IpVersion): string {
	const bits = n.toString(2).padStart(BITS[v], '0');
	const size = v === 4 ? 8 : 16;
	return (bits.match(new RegExp(`.{${size}}`, 'g')) ?? []).join(v === 4 ? '.' : ':');
}

function reverseName(n: bigint, v: IpVersion): string {
	if (v === 4) return `${formatIPv4(n).split('.').reverse().join('.')}.in-addr.arpa`;
	return `${n.toString(16).padStart(32, '0').split('').reverse().join('.')}.ip6.arpa`;
}

function block(value: bigint, prefix: number, v: IpVersion): CidrBlock {
	const bits = BITS[v];
	const mask = maskOf(prefix, v);
	const network = value & mask;
	const size = 1n << BigInt(bits - prefix);
	const last = network + size - 1n;
	// IPv4 reserves the network and broadcast addresses, except on /31
	// point-to-point links (RFC 3021) and single-host /32s. IPv6 has no
	// broadcast, so every address is assignable.
	const reserves = v === 4 && prefix < 31;
	const firstHost = reserves ? network + 1n : network;
	const lastHost = reserves ? last - 1n : last;
	return {
		kind: 'block',
		version: v,
		prefix,
		address: formatIp(value, v),
		network: formatIp(network, v),
		last: formatIp(last, v),
		firstHost: formatIp(firstHost, v),
		lastHost: formatIp(lastHost, v),
		netmask: v === 4 ? formatIPv4(mask) : undefined,
		wildcard: v === 4 ? formatIPv4(~mask & 0xffffffffn) : undefined,
		total: size.toString(),
		usable: (reserves ? size - 2n : size).toString(),
		hostBitsSet: value !== network,
		scope: scopeOf(network, prefix, v),
		expanded: v === 6 ? expandIPv6(value) : undefined,
		integer: value.toString(),
		hex: '0x' + value.toString(16).padStart(bits / 4, '0'),
		binary: binaryOf(value, v),
		reverse: reverseName(value, v)
	};
}

/**
 * Split start..end into the fewest aligned CIDR blocks: at each step take the
 * largest block that starts at `start` (limited by its alignment) and doesn't
 * run past `end`.
 */
export function rangeToCidrs(start: bigint, end: bigint, v: IpVersion): string[] {
	const bits = BITS[v];
	const out: string[] = [];
	let cur = start;
	while (cur <= end) {
		let size = bits;
		// Alignment: the number of trailing zero bits of cur caps the block size.
		while (size > 0 && (cur & ((1n << BigInt(bits - size + 1)) - 1n)) === 0n && cur + (1n << BigInt(bits - size + 1)) - 1n <= end)
			size--;
		out.push(`${formatIp(cur, v)}/${size}`);
		cur += 1n << BigInt(bits - size);
	}
	return out;
}

/**
 * Analyze what someone pastes into a subnet calculator: `10.0.0.0/8`,
 * `2001:db8::/48`, a bare address, `192.168.1.0 255.255.255.0` (netmask
 * notation), or a range `10.0.0.1 - 10.0.0.100`.
 */
export function analyzeCidr(input: string): ToolResult<CidrAnalysis> {
	const s = input.trim();
	if (!s) return err('Enter a CIDR block like 192.168.1.0/24, an IP address, or a range');

	const dash = s.match(/^([0-9a-f.:]+)\s*(?:-|–|—|\bto\b)\s*([0-9a-f.:]+)$/i);
	if (dash) {
		const a = parseIp(dash[1]);
		if (!a.ok) return err(a.error);
		const b = parseIp(dash[2]);
		if (!b.ok) return err(b.error);
		if (a.value.version !== b.value.version) return err('A range must have IPv4 or IPv6 addresses on both ends, not one of each');
		const v = a.value.version;
		const [lo, hi] = a.value.value <= b.value.value ? [a.value.value, b.value.value] : [b.value.value, a.value.value];
		return ok({
			kind: 'range',
			version: v,
			start: formatIp(lo, v),
			end: formatIp(hi, v),
			total: (hi - lo + 1n).toString(),
			cidrs: rangeToCidrs(lo, hi, v)
		});
	}

	// "addr/prefix", "addr/netmask" or "addr netmask".
	const m = s.match(/^(\S+?)(?:\s*\/\s*|\s+)(\S+)$/);
	const addrText = m ? m[1] : s;
	const suffix = m ? m[2] : null;
	const ip = parseIp(addrText);
	if (!ip.ok) return err(ip.error);
	const { value, version } = ip.value;
	const bits = BITS[version];

	let prefix = bits;
	if (suffix !== null) {
		if (/^\d+$/.test(suffix)) {
			prefix = Number(suffix);
			if (prefix > bits) return err(`/${prefix} is too long — an IPv${version} prefix is 0 to ${bits}`);
		} else if (version === 4 && suffix.includes('.')) {
			const mask = parseIPv4(suffix);
			if (!mask.ok) return err(`The netmask is invalid: ${mask.error}`);
			const p = maskToPrefix(mask.value);
			if (p === null) {
				// Cisco ACLs write wildcard masks (0.0.0.255); accept those too.
				const wp = maskToPrefix(~mask.value & 0xffffffffn);
				if (wp === null) return err(`${suffix} is not a valid netmask — the 1 bits must be contiguous from the left`);
				prefix = wp;
			} else prefix = p;
		} else return err(`"${suffix}" is not a prefix length — write it like /24`);
	}
	return ok(block(value, prefix, version));
}

/** Whether `ip` falls inside the analyzed block; an error if `ip` isn't a valid address. */
export function blockContains(b: CidrBlock, ip: string): ToolResult<boolean> {
	const r = parseIp(ip.trim());
	if (!r.ok) return err(r.error);
	if (r.value.version !== b.version) return ok(false);
	const net = parseIp(b.network);
	if (!net.ok) return err(net.error);
	return ok((r.value.value & maskOf(b.prefix, b.version)) === net.value.value);
}

export interface SubnetList {
	prefix: number;
	count: string;
	/** The first `limit` subnets — enough to plan with, not 2⁶⁴ rows. */
	subnets: string[];
}

/** Divide a block into equal subnets of `newPrefix`. */
export function splitBlock(b: CidrBlock, newPrefix: number, limit = 256): ToolResult<SubnetList> {
	const bits = BITS[b.version];
	if (newPrefix < b.prefix || newPrefix > bits)
		return err(`Pick a prefix between /${b.prefix} and /${bits}`);
	const net = parseIp(b.network);
	if (!net.ok) return err(net.error);
	const count = 1n << BigInt(newPrefix - b.prefix);
	const step = 1n << BigInt(bits - newPrefix);
	const subnets: string[] = [];
	for (let i = 0n; i < count && i < BigInt(limit); i++)
		subnets.push(`${formatIp(net.value.value + i * step, b.version)}/${newPrefix}`);
	return ok({ prefix: newPrefix, count: count.toString(), subnets });
}

/** For Smart Paste: an IPv4/IPv6 CIDR block or a dotted-quad range, nothing looser. */
export function isLikelyCidr(input: string): boolean {
	const s = input.trim();
	if (s.length > 100 || /\n/.test(s)) return false;
	const m = s.match(/^([0-9a-fA-F.:]+)\/(\d{1,3})$/);
	if (m) {
		const r = analyzeCidr(s);
		return r.ok;
	}
	if (/^\d{1,3}(\.\d{1,3}){3}\s*-\s*\d{1,3}(\.\d{1,3}){3}$/.test(s)) return analyzeCidr(s).ok;
	return false;
}
