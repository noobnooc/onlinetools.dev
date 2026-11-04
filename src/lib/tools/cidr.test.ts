import { describe, expect, it } from 'vitest';
import {
	aggregateCidrs,
	analyzeCidr,
	blockContains,
	formatIPv6,
	isCidrList,
	isLikelyCidr,
	maskToPrefix,
	parseIPv4,
	parseIPv6,
	rangeToCidrs,
	splitBlock,
	type CidrBlock,
	type CidrRange
} from './cidr';

function blockOf(input: string): CidrBlock {
	const r = analyzeCidr(input);
	if (!r.ok) throw new Error(r.error);
	if (r.value.kind !== 'block') throw new Error('expected a block');
	return r.value;
}

function rangeOf(input: string): CidrRange {
	const r = analyzeCidr(input);
	if (!r.ok) throw new Error(r.error);
	if (r.value.kind !== 'range') throw new Error('expected a range');
	return r.value;
}

describe('parseIPv4', () => {
	it('parses dotted quads', () => {
		expect(parseIPv4('192.168.1.1')).toEqual({ ok: true, value: 0xc0a80101n });
		expect(parseIPv4('0.0.0.0')).toEqual({ ok: true, value: 0n });
		expect(parseIPv4('255.255.255.255')).toEqual({ ok: true, value: 0xffffffffn });
	});
	it('rejects out-of-range octets, wrong part counts and junk', () => {
		expect(parseIPv4('256.0.0.1').ok).toBe(false);
		expect(parseIPv4('1.2.3').ok).toBe(false);
		expect(parseIPv4('1.2.3.4.5').ok).toBe(false);
		expect(parseIPv4('1.2.3.x').ok).toBe(false);
		expect(parseIPv4('1.2.3.').ok).toBe(false);
	});
	it('rejects leading zeros instead of guessing octal vs decimal', () => {
		const r = parseIPv4('10.0.0.010');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toMatch(/octal/);
	});
});

describe('parseIPv6 / formatIPv6', () => {
	it('expands "::" and round-trips to the RFC 5952 form', () => {
		const r = parseIPv6('2001:0DB8:0000:0000:0000:ff00:0042:8329');
		expect(r.ok).toBe(true);
		if (r.ok) expect(formatIPv6(r.value)).toBe('2001:db8::ff00:42:8329');
	});
	it('handles the edge positions of "::"', () => {
		for (const s of ['::', '::1', 'fe80::', '1::']) {
			const r = parseIPv6(s);
			expect(r.ok).toBe(true);
			if (r.ok) expect(formatIPv6(r.value)).toBe(s);
		}
	});
	it('compresses the longest zero run, the first one on a tie, and never a single group', () => {
		const a = parseIPv6('1:0:0:2:0:0:0:3');
		if (a.ok) expect(formatIPv6(a.value)).toBe('1:0:0:2::3');
		const b = parseIPv6('1:0:0:2:0:0:3:4');
		if (b.ok) expect(formatIPv6(b.value)).toBe('1::2:0:0:3:4');
		const c = parseIPv6('1:2:3:4:5:6:0:8');
		if (c.ok) expect(formatIPv6(c.value)).toBe('1:2:3:4:5:6:0:8');
	});
	it('accepts an embedded IPv4 tail', () => {
		const r = parseIPv6('::ffff:192.0.2.1');
		expect(r).toEqual({ ok: true, value: 0xffffc0000201n });
	});
	it('rejects malformed addresses with a reason', () => {
		expect(parseIPv6('1::2::3').ok).toBe(false);
		expect(parseIPv6('1:2:3:4:5:6:7').ok).toBe(false);
		expect(parseIPv6('1:2:3:4:5:6:7:8:9').ok).toBe(false);
		expect(parseIPv6('12345::').ok).toBe(false);
		expect(parseIPv6('g::1').ok).toBe(false);
		const zone = parseIPv6('fe80::1%eth0');
		expect(zone.ok).toBe(false);
		if (!zone.ok) expect(zone.error).toMatch(/zone/);
	});
});

describe('maskToPrefix', () => {
	it('converts contiguous masks and rejects the rest', () => {
		expect(maskToPrefix(0xffffff00n)).toBe(24);
		expect(maskToPrefix(0xffffffffn)).toBe(32);
		expect(maskToPrefix(0n)).toBe(0);
		expect(maskToPrefix(0xff00ff00n)).toBeNull();
	});
});

describe('analyzeCidr — IPv4 blocks', () => {
	it('computes the classic /24', () => {
		const b = blockOf('192.168.1.0/24');
		expect(b).toMatchObject({
			version: 4,
			prefix: 24,
			network: '192.168.1.0',
			last: '192.168.1.255',
			firstHost: '192.168.1.1',
			lastHost: '192.168.1.254',
			netmask: '255.255.255.0',
			wildcard: '0.0.0.255',
			total: '256',
			usable: '254',
			hostBitsSet: false,
			reverse: '0.1.168.192.in-addr.arpa'
		});
		expect(b.scope).toEqual({ name: 'Private', ref: 'RFC 1918' });
		expect(b.binary).toBe('11000000.10101000.00000001.00000000');
		expect(b.hex).toBe('0xc0a80100');
	});
	it('flags host bits and still reports the real network', () => {
		const b = blockOf('10.1.2.3/8');
		expect(b.hostBitsSet).toBe(true);
		expect(b.address).toBe('10.1.2.3');
		expect(b.network).toBe('10.0.0.0');
		expect(b.last).toBe('10.255.255.255');
	});
	it('treats /31 as two usable hosts (RFC 3021) and /32 as one', () => {
		expect(blockOf('10.0.0.0/31')).toMatchObject({ usable: '2', firstHost: '10.0.0.0', lastHost: '10.0.0.1' });
		expect(blockOf('10.0.0.7/32')).toMatchObject({ usable: '1', total: '1', network: '10.0.0.7' });
	});
	it('defaults a bare address to /32', () => {
		expect(blockOf('8.8.8.8')).toMatchObject({ prefix: 32, scope: { name: 'Public', ref: '' } });
	});
	it('handles /0', () => {
		expect(blockOf('0.0.0.0/0')).toMatchObject({ total: '4294967296', last: '255.255.255.255' });
	});
	it('accepts netmask and wildcard notation', () => {
		expect(blockOf('172.16.5.4 255.255.240.0')).toMatchObject({ prefix: 20, network: '172.16.0.0' });
		expect(blockOf('172.16.5.4/255.255.240.0').prefix).toBe(20);
		expect(blockOf('192.168.0.0 0.0.0.255').prefix).toBe(24);
	});
	it('tolerates surrounding whitespace and spaces around the slash', () => {
		expect(blockOf('  10.0.0.0 / 16 \n').prefix).toBe(16);
	});
	it('labels special-purpose ranges, preferring the most specific one', () => {
		expect(blockOf('100.64.0.1').scope.ref).toBe('RFC 6598');
		expect(blockOf('127.0.0.1').scope.name).toBe('Loopback');
		expect(blockOf('169.254.169.254').scope.name).toBe('Link-local');
		expect(blockOf('203.0.113.0/24').scope.ref).toBe('RFC 5737');
		expect(blockOf('224.0.0.251').scope.name).toBe('Multicast');
		// 172.32.0.0 is just outside 172.16.0.0/12.
		expect(blockOf('172.32.0.1').scope.name).toBe('Public');
		// A block wider than the private range isn't private as a whole.
		expect(blockOf('10.0.0.0/7').scope.name).toBe('Public');
	});
	it('rejects invalid prefixes and masks with a reason', () => {
		expect(analyzeCidr('10.0.0.0/33').ok).toBe(false);
		expect(analyzeCidr('10.0.0.0/abc').ok).toBe(false);
		expect(analyzeCidr('10.0.0.0 255.0.255.0').ok).toBe(false);
		expect(analyzeCidr('').ok).toBe(false);
		expect(analyzeCidr('hello world').ok).toBe(false);
	});
});

describe('analyzeCidr — IPv6 blocks', () => {
	it('computes a /48', () => {
		const b = blockOf('2001:db8:abcd::/48');
		expect(b).toMatchObject({
			version: 6,
			network: '2001:db8:abcd::',
			last: '2001:db8:abcd:ffff:ffff:ffff:ffff:ffff',
			total: '1208925819614629174706176',
			usable: '1208925819614629174706176',
			scope: { name: 'Documentation', ref: 'RFC 3849' }
		});
		expect(b.netmask).toBeUndefined();
		expect(b.expanded).toBe('2001:0db8:abcd:0000:0000:0000:0000:0000');
	});
	it('normalizes the typed address and flags host bits', () => {
		const b = blockOf('FE80::1/64');
		expect(b.address).toBe('fe80::1');
		expect(b.network).toBe('fe80::');
		expect(b.hostBitsSet).toBe(true);
		expect(b.scope.name).toBe('Link-local');
	});
	it('handles ::/0 exactly with BigInt', () => {
		expect(blockOf('::/0').total).toBe((2n ** 128n).toString());
	});
	it('builds the ip6.arpa name', () => {
		expect(blockOf('2001:db8::1').reverse).toBe(
			'1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa'
		);
	});
	it('rejects prefixes over 128', () => {
		expect(analyzeCidr('::1/129').ok).toBe(false);
	});
});

describe('ranges', () => {
	it('splits an unaligned range into the fewest blocks', () => {
		expect(rangeOf('10.0.0.1 - 10.0.0.10').cidrs).toEqual([
			'10.0.0.1/32',
			'10.0.0.2/31',
			'10.0.0.4/30',
			'10.0.0.8/31',
			'10.0.0.10/32'
		]);
	});
	it('collapses an aligned range to one block', () => {
		const r = rangeOf('192.168.0.0-192.168.255.255');
		expect(r.cidrs).toEqual(['192.168.0.0/16']);
		expect(r.total).toBe('65536');
	});
	it('accepts reversed ends, "to" and en dashes', () => {
		expect(rangeOf('10.0.0.3 to 10.0.0.0').cidrs).toEqual(['10.0.0.0/30']);
		expect(rangeOf('10.0.0.0 – 10.0.0.3').start).toBe('10.0.0.0');
	});
	it('works for the whole address space and for IPv6', () => {
		expect(rangeToCidrs(0n, 0xffffffffn, 4)).toEqual(['0.0.0.0/0']);
		expect(rangeOf('2001:db8:: - 2001:db8::ff').cidrs).toEqual(['2001:db8::/120']);
	});
	it('refuses to mix families', () => {
		expect(analyzeCidr('10.0.0.1 - ::1').ok).toBe(false);
	});
});

describe('blockContains / splitBlock', () => {
	it('checks membership', () => {
		const b = blockOf('10.0.0.0/8');
		expect(blockContains(b, '10.200.1.1')).toEqual({ ok: true, value: true });
		expect(blockContains(b, '11.0.0.1')).toEqual({ ok: true, value: false });
		expect(blockContains(b, '::1')).toEqual({ ok: true, value: false });
		expect(blockContains(b, 'nope').ok).toBe(false);
	});
	it('splits into equal subnets, capped for display', () => {
		const r = splitBlock(blockOf('10.0.0.0/22'), 24);
		expect(r).toEqual({
			ok: true,
			value: { prefix: 24, count: '4', subnets: ['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/24', '10.0.3.0/24'] }
		});
		const big = splitBlock(blockOf('2001:db8::/32'), 64, 3);
		expect(big.ok && big.value.count).toBe((2n ** 32n).toString());
		expect(big.ok && big.value.subnets).toEqual(['2001:db8::/64', '2001:db8:0:1::/64', '2001:db8:0:2::/64']);
		expect(splitBlock(blockOf('10.0.0.0/24'), 16).ok).toBe(false);
	});
});

describe('isLikelyCidr', () => {
	it('recognizes CIDR blocks and IPv4 ranges only', () => {
		expect(isLikelyCidr('10.0.0.0/8')).toBe(true);
		expect(isLikelyCidr('2001:db8::/32')).toBe(true);
		expect(isLikelyCidr('10.0.0.1 - 10.0.0.9')).toBe(true);
		expect(isLikelyCidr('10.0.0.1')).toBe(false);
		expect(isLikelyCidr('1/2')).toBe(false);
		expect(isLikelyCidr('999.0.0.0/8')).toBe(false);
		expect(isLikelyCidr('2024-01-01')).toBe(false);
	});
});

function listOf(input: string, exclude = '') {
	const r = aggregateCidrs(input, exclude);
	if (!r.ok) throw new Error(r.error);
	return r.value;
}

describe('aggregateCidrs', () => {
	it('merges adjacent and overlapping blocks into the fewest CIDRs', () => {
		expect(listOf('10.0.0.0/24\n10.0.1.0/24').cidrs).toEqual(['10.0.0.0/23']);
		expect(listOf('10.0.0.0/24\n10.0.0.128/25\n10.0.0.5').cidrs).toEqual(['10.0.0.0/24']);
		// Adjacent but not aligned: /23 can't start at .1.0.
		expect(listOf('10.0.1.0/24\n10.0.2.0/24').cidrs).toEqual(['10.0.1.0/24', '10.0.2.0/24']);
		expect(listOf('10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/23').cidrs).toEqual(['10.0.0.0/22']);
	});
	it('sorts, dedupes and keeps IPv4 before IPv6', () => {
		const l = listOf('2001:db8:1::/48\n192.168.1.0/24\n2001:db8::/48\n10.0.0.0/8\n10.0.0.0/8');
		expect(l.cidrs).toEqual(['10.0.0.0/8', '192.168.1.0/24', '2001:db8::/47']);
		expect(l.entries).toBe(5);
		expect(l.v4).toEqual({ cidrs: 2, total: String(2 ** 24 + 256) });
		expect(l.v6.cidrs).toBe(1);
	});
	it('accepts ranges, bare addresses, netmasks and comments', () => {
		const l = listOf('# office\n10.0.0.1 - 10.0.0.3 // three hosts\n10.0.0.0\n\n172.16.0.0 255.255.0.0');
		expect(l.cidrs).toEqual(['10.0.0.0/30', '172.16.0.0/16']);
		expect(l.entries).toBe(3);
	});
	it('normalizes host bits per entry, as routers do', () => {
		expect(listOf('10.1.2.3/8').cidrs).toEqual(['10.0.0.0/8']);
	});
	it('subtracts an exclude list (WireGuard AllowedIPs minus the LAN)', () => {
		const l = listOf('0.0.0.0/0', '192.168.0.0/16');
		expect(l.cidrs).toEqual([
			'0.0.0.0/1',
			'128.0.0.0/2',
			'192.0.0.0/9',
			'192.128.0.0/11',
			'192.160.0.0/13',
			'192.169.0.0/16',
			'192.170.0.0/15',
			'192.172.0.0/14',
			'192.176.0.0/12',
			'192.192.0.0/10',
			'193.0.0.0/8',
			'194.0.0.0/7',
			'196.0.0.0/6',
			'200.0.0.0/5',
			'208.0.0.0/4',
			'224.0.0.0/3'
		]);
		expect(l.v4.total).toBe(String(2 ** 32 - 2 ** 16));
		expect(l.excluded).toBe(1);
	});
	it('handles exclusions at the edges, inside each other and of the other version', () => {
		expect(listOf('10.0.0.0/24', '10.0.0.0/25').cidrs).toEqual(['10.0.0.128/25']);
		expect(listOf('10.0.0.0/24', '10.0.0.255').cidrs.at(-1)).toBe('10.0.0.254/32');
		expect(listOf('10.0.0.0/24', '10.0.0.0/8').cidrs).toEqual([]);
		expect(listOf('10.0.0.0/24', '2001:db8::/32').cidrs).toEqual(['10.0.0.0/24']);
		expect(listOf('::/0', '::1').v6.cidrs).toBe(128);
		expect(listOf('10.0.0.0/24', '10.0.0.10\n10.0.0.20').cidrs).toEqual([
			'10.0.0.0/29',
			'10.0.0.8/31',
			'10.0.0.11/32',
			'10.0.0.12/30',
			'10.0.0.16/30',
			'10.0.0.21/32',
			'10.0.0.22/31',
			'10.0.0.24/29',
			'10.0.0.32/27',
			'10.0.0.64/26',
			'10.0.0.128/25'
		]);
	});
	it('reports bad lines with their line number and keeps the rest', () => {
		const l = listOf('10.0.0.0/24\n10.0.0.300/24\n10.0.1.0/24', 'nope');
		expect(l.cidrs).toEqual(['10.0.0.0/23']);
		expect(l.errors).toHaveLength(2);
		expect(l.errors[0]).toMatchObject({ source: 'input', line: 2, entry: '10.0.0.300/24' });
		expect(l.errors[1]).toMatchObject({ source: 'exclude', line: 1, entry: 'nope' });
	});
	it('errors when nothing valid is left to aggregate', () => {
		expect(aggregateCidrs('').ok).toBe(false);
		const r = aggregateCidrs('# only a comment\nfoo');
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error).toMatch(/^Line 2:/);
	});
	it('handles non-ASCII junk and Windows line endings', () => {
		const l = listOf('10.0.0.0/24\r\n10.0.1.0/24\r\n１０.0.0.0/8');
		expect(l.cidrs).toEqual(['10.0.0.0/23']);
		expect(l.errors).toHaveLength(1);
	});
});

describe('isCidrList', () => {
	it('is true only for more than one entry', () => {
		expect(isCidrList('10.0.0.0/8')).toBe(false);
		expect(isCidrList('10.0.0.1 - 10.0.0.9')).toBe(false);
		expect(isCidrList('10.0.0.0/8\n')).toBe(false);
		expect(isCidrList('10.0.0.0/8\n10.1.0.0/16')).toBe(true);
		expect(isCidrList('10.0.0.0/8, 10.1.0.0/16')).toBe(true);
	});
});

describe('isLikelyCidr lists', () => {
	it('accepts a list of blocks and rejects mixed text', () => {
		expect(isLikelyCidr('10.0.0.0/8\n10.1.0.0/16\n')).toBe(true);
		expect(isLikelyCidr('10.0.0.0/8\nhello')).toBe(false);
	});
});
