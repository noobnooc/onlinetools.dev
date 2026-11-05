import { describe, expect, it } from 'vitest';
import {
	buildOtpauthUri,
	decodeBase32,
	encodeBase32,
	findCode,
	generateSecret,
	hotp,
	isLikelyOtpauth,
	otpWindows,
	parseOtpInput,
	secondsLeft,
	timeStep,
	type OtpAlgorithm,
	type ParsedOtp
} from './totp';

const ascii = (s: string) => new TextEncoder().encode(s);
const SEED1 = ascii('12345678901234567890');
const SEED256 = ascii('12345678901234567890123456789012');
const SEED512 = ascii('1234567890123456789012345678901234567890123456789012345678901234');

function parsed(r: ReturnType<typeof parseOtpInput>): ParsedOtp {
	if (!r.ok) throw new Error(r.error);
	return r.value;
}

describe('base32', () => {
	it('round-trips the RFC 4648 vectors', () => {
		const cases: Array<[string, string]> = [
			['f', 'MY'],
			['fo', 'MZXQ'],
			['foo', 'MZXW6'],
			['foob', 'MZXW6YQ'],
			['fooba', 'MZXW6YTB'],
			['foobar', 'MZXW6YTBOI']
		];
		for (const [plain, b32] of cases) {
			expect(encodeBase32(ascii(plain))).toBe(b32);
			const d = decodeBase32(b32 + '='.repeat((8 - (b32.length % 8)) % 8));
			expect(d.ok && new TextDecoder().decode(d.value)).toBe(plain);
		}
	});

	it('accepts lowercase, spaces and hyphens', () => {
		const d = decodeBase32('jbsw y3dp-ehpk 3pxp');
		expect(d.ok && encodeBase32(d.value)).toBe('JBSWY3DPEHPK3PXP');
	});

	it('points at a bad character and suggests the look-alike', () => {
		const d = decodeBase32('JBSW0Y3DP');
		expect(d.ok).toBe(false);
		if (!d.ok) {
			expect(d.column).toBe(5);
			expect(d.error).toContain('did you mean O');
		}
	});

	it('rejects padding in the middle and empty input', () => {
		expect(decodeBase32('MY==MY').ok).toBe(false);
		expect(decodeBase32('  ').ok).toBe(false);
	});
});

describe('hotp (RFC 4226 appendix D)', () => {
	it('matches the ten published codes', async () => {
		const want = ['755224', '287082', '359152', '969429', '338314', '254676', '287922', '162583', '399871', '520489'];
		for (let c = 0; c < want.length; c++) expect(await hotp(SEED1, c)).toBe(want[c]);
	});
});

describe('totp (RFC 6238 appendix B)', () => {
	const table: Array<[number, string, string, string]> = [
		[59, '94287082', '46119246', '90693936'],
		[1111111109, '07081804', '68084774', '25091201'],
		[1111111111, '14050471', '67062674', '99943326'],
		[1234567890, '89005924', '91819424', '93441116'],
		[2000000000, '69279037', '90698825', '38618901'],
		[20000000000, '65353130', '77737706', '47863826']
	];
	const seeds: Array<[OtpAlgorithm, Uint8Array]> = [
		['SHA-1', SEED1],
		['SHA-256', SEED256],
		['SHA-512', SEED512]
	];
	it('matches every vector for SHA-1, SHA-256 and SHA-512', async () => {
		for (const [t, ...codes] of table) {
			for (let i = 0; i < seeds.length; i++) {
				const [alg, seed] = seeds[i];
				expect(await hotp(seed, timeStep(t * 1000, 30), alg, 8)).toBe(codes[i]);
			}
		}
	});

	it('works the same through a parsed secret', async () => {
		const p = parsed(parseOtpInput(encodeBase32(SEED1), { digits: 8 }));
		const w = await otpWindows(p, 59_000, 0);
		expect(w).toEqual([{ offset: 0, counter: 1, code: '94287082' }]);
	});

	it('counts down to the next step', () => {
		expect(secondsLeft(0, 30)).toBe(30);
		expect(secondsLeft(29_999, 30)).toBe(1);
		expect(secondsLeft(30_000, 30)).toBe(30);
	});
});

describe('parseOtpInput', () => {
	it('reads a full otpauth URI', () => {
		const p = parsed(
			parseOtpInput('otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA256&digits=8&period=60')
		);
		expect(p.source).toBe('uri');
		expect(p.params).toMatchObject({
			type: 'totp',
			issuer: 'ACME Co',
			account: 'john.doe@email.com',
			algorithm: 'SHA-256',
			digits: 8,
			period: 60
		});
		expect(p.warnings).toEqual(['nonDefault']);
	});

	it('falls back to the label prefix for the issuer, and handles non-ASCII labels', () => {
		const p = parsed(parseOtpInput('otpauth://totp/%E7%A4%BA%E4%BE%8B:%E7%94%A8%E6%88%B7?secret=JBSWY3DPEHPK3PXP'));
		expect(p.params.issuer).toBe('示例');
		expect(p.params.account).toBe('用户');
		expect(p.warnings).toEqual(['shortSecret']);
	});

	it('reads HOTP counters and requires them', () => {
		expect(parsed(parseOtpInput('otpauth://hotp/x?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ&counter=7')).params.counter).toBe(7);
		expect(parseOtpInput('otpauth://hotp/x?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ').ok).toBe(false);
	});

	it('explains malformed URIs', () => {
		const cases = [
			['otpauth://totp/x', 'secret='],
			['otpauth://push/x?secret=JBSWY3DP', 'Unknown OTP type'],
			['otpauth://totp/x?secret=JBSWY3DP&algorithm=MD5', 'Unsupported algorithm'],
			['otpauth://totp/x?secret=JBSWY3DP&digits=4', 'digits=4'],
			['otpauth://totp/x?secret=JBSWY3DP&period=0', 'period=0'],
			['otpauth://totp/x?secret=JBSW!', 'not a Base32 character'],
			['otpauth-migration://offline?data=abc', 'Google Authenticator export']
		];
		for (const [input, msg] of cases) {
			const r = parseOtpInput(input);
			expect(r.ok, input).toBe(false);
			if (!r.ok) expect(r.error).toContain(msg);
		}
	});

	it('applies options to a bare secret and validates them', () => {
		const p = parsed(parseOtpInput(' jbsw y3dp ehpk 3pxp ', { algorithm: 'SHA-512', digits: 7, period: 15 }));
		expect(p.source).toBe('secret');
		expect(p.params).toMatchObject({ secret: 'JBSWY3DPEHPK3PXP', algorithm: 'SHA-512', digits: 7, period: 15 });
		expect(parseOtpInput('JBSWY3DP', { digits: 9 }).ok).toBe(false);
		expect(parseOtpInput('JBSWY3DP', { period: 1.5 }).ok).toBe(false);
		expect(parseOtpInput('').ok).toBe(false);
	});
});

describe('buildOtpauthUri', () => {
	it('omits defaults and round-trips', () => {
		const p = parsed(parseOtpInput('otpauth://totp/Example:alice@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example'));
		const uri = buildOtpauthUri(p.params);
		expect(uri).toBe('otpauth://totp/Example:alice%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example');
		expect(parsed(parseOtpInput(uri)).params).toEqual(p.params);
	});

	it('keeps non-default parameters and HOTP counters', () => {
		const p = parsed(parseOtpInput('JBSWY3DPEHPK3PXP', { type: 'hotp', counter: 3, algorithm: 'SHA-256', digits: 8 }));
		const uri = buildOtpauthUri({ ...p.params, account: 'bob' });
		expect(uri).toBe('otpauth://hotp/bob?secret=JBSWY3DPEHPK3PXP&algorithm=SHA256&digits=8&counter=3');
		expect(parsed(parseOtpInput(uri)).params.counter).toBe(3);
	});
});

describe('findCode', () => {
	it('finds the nearest window, or null', async () => {
		const p = parsed(parseOtpInput(encodeBase32(SEED1), { digits: 8 }));
		// 94287082 is step 1 (t = 30…59 s); from t = 95 s (step 3) it is two steps back.
		expect(await findCode(p, '9428 7082', 95_000)).toBe(-2);
		expect(await findCode(p, '94287082', 45_000)).toBe(0);
		expect(await findCode(p, '00000000', 45_000, 2)).toBe(null);
	});
});

describe('helpers', () => {
	it('generates a 160-bit secret from the injected source', () => {
		expect(generateSecret(20, (n) => new Uint8Array(n))).toBe('A'.repeat(32));
		expect(generateSecret()).toMatch(/^[A-Z2-7]{32}$/);
	});

	it('recognizes otpauth URIs only', () => {
		expect(isLikelyOtpauth('otpauth://totp/x?secret=JBSWY3DP')).toBe(true);
		expect(isLikelyOtpauth('otpauth://hotp/Issuer:me?counter=1&secret=JBSWY3DP')).toBe(true);
		expect(isLikelyOtpauth('https://example.com/?secret=x')).toBe(false);
		expect(isLikelyOtpauth('otpauth://totp/x')).toBe(false);
	});
});
