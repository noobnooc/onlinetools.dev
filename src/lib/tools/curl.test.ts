import { describe, expect, it } from 'vitest';
import { convertCurl, isLikelyCurl, parseCurl, tokenize, type CurlTarget } from './curl';

function req(input: string) {
	const r = parseCurl(input);
	if (!r.ok) throw new Error(r.error);
	return r.value.request;
}

function warnings(input: string) {
	const r = parseCurl(input);
	if (!r.ok) throw new Error(r.error);
	return r.value.warnings.map((w) => w.code);
}

function code(input: string, target: CurlTarget) {
	const r = convertCurl(input, target);
	if (!r.ok) throw new Error(r.error);
	return r.value.code;
}

describe('tokenize', () => {
	it('follows bash quoting and line continuations', () => {
		const r = tokenize(`curl 'https://a.test/x?y=1' \\\n  -H "Accept: \\"q\\" \\$HOME" -d it\\'s`);
		expect(r.ok && r.value.args).toEqual(['curl', 'https://a.test/x?y=1', '-H', 'Accept: "q" $HOME', '-d', "it's"]);
	});

	it("decodes $'…' strings the way Chrome emits them", () => {
		const r = tokenize("curl x --data-raw $'{\"a\":\"line\\nnext \\u00e9 it\\'s\"}'");
		expect(r.ok && r.value.args[3]).toBe('{"a":"line\nnext é it\'s"}');
	});

	it('reads Windows cmd copies with ^ escapes', () => {
		const r = tokenize('curl ^"https://a.test/^" ^\n  -H ^"accept: */*^" ^\n  --data-raw ^"^{^\\^"a^\\^":1^}^"');
		expect(r.ok && r.value.args).toEqual(['curl', 'https://a.test/', '-H', 'accept: */*', '--data-raw', '{"a":1}']);
	});

	it('stops at a pipe and reports an unclosed quote with its position', () => {
		const piped = tokenize('curl https://a.test | jq .');
		expect(piped.ok && piped.value).toEqual({ args: ['curl', 'https://a.test'], trailing: true });
		const open = tokenize("curl -d 'oops");
		expect(open).toMatchObject({ ok: false, line: 1, column: 9 });
	});
});

describe('parseCurl', () => {
	it('infers POST and the form Content-Type from -d, joining pieces with &', () => {
		const r = req('curl https://a.test -d a=1 -d b=2');
		expect(r.method).toBe('POST');
		expect(r.body).toEqual({ kind: 'text', text: 'a=1&b=2' });
		expect(r.headers).toContainEqual(['Content-Type', 'application/x-www-form-urlencoded']);
	});

	it('moves data into the query with -G', () => {
		const r = req('curl -G https://a.test/s?x=1 --data-urlencode "q=café & co"');
		expect(r.method).toBe('GET');
		expect(r.url).toBe('https://a.test/s?x=1&q=caf%c3%a9+%26+co');
		expect(r.body).toBeNull();
	});

	it('handles short option clusters and attached values', () => {
		const r = req("curl -sSLkXPUT -H'X-A: 1' -uadmin:s3:cret https://a.test");
		expect(r.method).toBe('PUT');
		expect(r.insecure).toBe(true);
		expect(r.headers).toEqual([['X-A', '1']]);
		expect(r.auth).toEqual({ user: 'admin', password: 's3:cret' });
	});

	it('maps --json, -A, -e, -b and --oauth2-bearer to headers', () => {
		const r = req(`curl --json '{"a":1}' -A bot/1 -e https://ref.test -b 'a=1; b=2' --oauth2-bearer T https://a.test`);
		expect(r.method).toBe('POST');
		expect(r.headers).toEqual([
			['User-Agent', 'bot/1'],
			['Referer', 'https://ref.test'],
			['Cookie', 'a=1; b=2'],
			['Authorization', 'Bearer T'],
			['Content-Type', 'application/json'],
			['Accept', 'application/json']
		]);
	});

	it('parses multipart fields, files and their attributes', () => {
		const r = req('curl -F name=Ada -F "photo=@me.png;type=image/png" -F "note=<notes.txt" -H "Content-Type: multipart/form-data" https://a.test');
		expect(r.body).toEqual({
			kind: 'form',
			parts: [
				{ name: 'name', value: 'Ada' },
				{ name: 'photo', file: 'me.png', filename: undefined, type: 'image/png' },
				{ name: 'note', file: 'notes.txt', filename: '', type: undefined }
			]
		});
		// A hand-written multipart type has no boundary, so it is dropped.
		expect(r.headers).toEqual([]);
	});

	it('treats -d @file as a file body and --data-raw @x as text', () => {
		expect(req('curl -d @body.json https://a.test').body).toEqual({ kind: 'file', path: 'body.json' });
		expect(req('curl --data-raw @x https://a.test').body).toEqual({ kind: 'text', text: '@x' });
	});

	it('uses HEAD for -I, PUT for -T, and an explicit -X over both', () => {
		expect(req('curl -I https://a.test').method).toBe('HEAD');
		expect(req('curl -T f.bin https://a.test').method).toBe('PUT');
		expect(req('curl -X post -d x https://a.test').method).toBe('POST');
	});

	it('removes a header curl would add when given "Name:"', () => {
		const r = req('curl -H "Content-Type:" -d x https://a.test');
		expect(r.headers).toEqual([]);
	});

	it('warns instead of failing on things it cannot carry over', () => {
		expect(warnings('curl --digest -u bob --frobnicate a.test/x -b jar.txt https://b.test | head')).toEqual([
			'trailing',
			'unsupportedOption',
			'passwordPrompt',
			'unknownOption',
			'cookieFile',
			'multipleUrls',
			'noScheme'
		]);
		expect(req('curl a.test/x').url).toBe('http://a.test/x');
	});

	it('accepts a shell prompt, curl.exe and a path to curl', () => {
		expect(req('$ curl https://a.test').url).toBe('https://a.test');
		expect(req('curl.exe https://a.test').url).toBe('https://a.test');
		expect(req('/usr/bin/curl https://a.test').url).toBe('https://a.test');
	});

	it('rejects input that is not a curl command, or has no URL', () => {
		expect(parseCurl('')).toMatchObject({ ok: false });
		expect(parseCurl('wget https://a.test')).toMatchObject({ ok: false, error: 'The command should start with curl' });
		expect(parseCurl('curl -s')).toMatchObject({ ok: false, error: 'No URL found in the command' });
		expect(parseCurl('curl -H')).toMatchObject({ ok: false, error: '-H needs a value' });
	});
});

describe('convertCurl', () => {
	const jsonPost = `curl https://api.test/users -H 'Content-Type: application/json' -H 'Authorization: Bearer abc' -d '{"name":"Ada","admin":true,"tags":[],"n":null}'`;

	it('writes fetch with a JSON.stringify body', () => {
		expect(code(jsonPost, 'fetch')).toBe(
			[
				"const response = await fetch('https://api.test/users', {",
				"  method: 'POST',",
				'  headers: {',
				"    'Content-Type': 'application/json',",
				"    'Authorization': 'Bearer abc'",
				'  },',
				'  body: JSON.stringify({',
				'    "name": "Ada",',
				'    "admin": true,',
				'    "tags": [],',
				'    "n": null',
				'  })',
				'});',
				'',
				'console.log(response.status, await response.text());'
			].join('\n')
		);
	});

	it('writes Python requests with json= and drops the implied Content-Type', () => {
		expect(code(jsonPost, 'python')).toBe(
			[
				'import requests',
				'',
				'headers = {',
				"    'Authorization': 'Bearer abc',",
				'}',
				'',
				'json_data = {',
				"    'name': 'Ada',",
				"    'admin': True,",
				"    'tags': [],",
				"    'n': None,",
				'}',
				'',
				"response = requests.post('https://api.test/users', headers=headers, json=json_data)",
				'',
				'print(response.status_code, response.text)'
			].join('\n')
		);
	});

	it('writes a Go program with the body, headers and error checks', () => {
		const out = code(jsonPost, 'go');
		expect(out).toContain('import (\n\t"fmt"\n\t"io"\n\t"net/http"\n\t"strings"\n)');
		expect(out).toContain('\tbody := strings.NewReader("{\\"name\\":\\"Ada\\",\\"admin\\":true,\\"tags\\":[],\\"n\\":null}")');
		expect(out).toContain('\treq, err := http.NewRequest("POST", "https://api.test/users", body)');
		expect(out).toContain('\treq.Header.Add("Authorization", "Bearer abc")');
		expect(out).toContain('\tresp, err := http.DefaultClient.Do(req)');
	});

	it('writes axios with a data object and curl-like status handling', () => {
		const out = code(jsonPost, 'axios');
		expect(out).toContain("method: 'post'");
		expect(out).toContain('data: {\n    "name": "Ada"');
		expect(out).toContain('validateStatus: () => true');
	});

	it('turns a urlencoded body into a dict for requests', () => {
		const out = code('curl https://a.test -d "q=hello+world" -d "lang=en%2Dus"', 'python');
		expect(out).toContain("data = {\n    'q': 'hello world',\n    'lang': 'en-us',\n}");
		expect(out).not.toContain('Content-Type');
		// Repeated keys can't be a dict, so the string and its header stay.
		const dup = code('curl https://a.test -d a=1 -d a=2', 'python');
		expect(dup).toContain("data = 'a=1&a=2'");
		expect(dup).toContain("'Content-Type': 'application/x-www-form-urlencoded'");
	});

	it('maps auth, timeout, proxy and -k in every target', () => {
		const cmd = 'curl -u u:p -m 2.5 -x proxy.test:3128 -k https://a.test';
		const f = convertCurl(cmd, 'fetch');
		expect(f.ok && f.value.code).toContain("'Authorization': 'Basic dTpw'");
		expect(f.ok && f.value.code).toContain('signal: AbortSignal.timeout(2500)');
		expect(f.ok && f.value.warnings.map((w) => w.code)).toEqual(['fetchProxy', 'fetchInsecure']);
		expect(f.ok && f.value.hasSecrets).toBe(true);
		const p = code(cmd, 'python');
		expect(p).toContain("auth=('u', 'p')");
		expect(p).toContain('verify=False');
		expect(p).toContain('timeout=2.5');
		expect(p).toContain("'https': 'http://proxy.test:3128'");
		const a = code(cmd, 'axios');
		expect(a).toContain("host: 'proxy.test',\n    port: 3128");
		expect(a).toContain('rejectUnauthorized: false');
		const g = code(cmd, 'go');
		expect(g).toContain('Timeout: 2500 * time.Millisecond');
		expect(g).toContain('InsecureSkipVerify: true');
		expect(g).toContain('req.SetBasicAuth("u", "p")');
		expect(g).toContain('"crypto/tls"');
	});

	it('writes multipart uploads for each target', () => {
		const cmd = 'curl -F name=Ada -F "photo=@pics/me.png;type=image/png" https://a.test/up';
		expect(code(cmd, 'fetch')).toContain("form.append('photo', await openAsBlob('pics/me.png', { type: 'image/png' }), 'me.png');");
		expect(code(cmd, 'python')).toContain("    ('photo', ('me.png', open('pics/me.png', 'rb'), 'image/png')),");
		const g = code(cmd, 'go');
		expect(g).toContain('w.WriteField("name", "Ada")');
		expect(g).toContain('h0.Set("Content-Type", "image/png")');
		expect(g).toContain('req.Header.Set("Content-Type", w.FormDataContentType())');
	});

	it('flags headers a browser fetch will not send', () => {
		const r = convertCurl("curl https://a.test -H 'User-Agent: x' -b 's=1'", 'fetch');
		expect(r.ok && r.value.warnings).toEqual([{ code: 'browserHeaders', detail: 'User-Agent, Cookie' }]);
	});

	it('uses requests.request for uncommon methods and keeps non-ASCII text', () => {
		const out = code("curl -X PURGE 'https://a.test/ü' -d 'naïve ✓'", 'python');
		expect(out).toContain("requests.request('PURGE', 'https://a.test/ü'");
		expect(out).toContain("data = 'naïve ✓'");
	});

	it('escapes quotes, backslashes and control characters in every language', () => {
		const cmd = `curl https://a.test --data-raw $'it\\'s \\\\ "q"\\x01'`;
		expect(code(cmd, 'fetch')).toContain(`body: 'it\\'s \\\\ "q"\\x01'`);
		expect(code(cmd, 'go')).toContain(`strings.NewReader("it's \\\\ \\"q\\"\\x01")`);
	});

	it('keeps a __proto__ key as a string body instead of an object literal', () => {
		const out = code(`curl https://a.test -H 'Content-Type: application/json' -d '{"__proto__":{"x":1}}'`, 'fetch');
		expect(out).toContain(`body: '{"__proto__":{"x":1}}'`);
	});

	it('reports whether the command carries credentials', () => {
		const plain = convertCurl('curl https://a.test', 'fetch');
		expect(plain.ok && plain.value.hasSecrets).toBe(false);
		const key = convertCurl("curl -H 'X-Api-Key: k' https://a.test", 'fetch');
		expect(key.ok && key.value.hasSecrets).toBe(true);
		const q = convertCurl("curl 'https://a.test/?access_token=t'", 'fetch');
		expect(q.ok && q.value.hasSecrets).toBe(true);
	});
});

describe('isLikelyCurl', () => {
	it('matches curl commands only', () => {
		expect(isLikelyCurl('curl https://a.test')).toBe(true);
		expect(isLikelyCurl('  $ curl -s x')).toBe(true);
		expect(isLikelyCurl("curl 'https://a.test'")).toBe(true);
		expect(isLikelyCurl('curl ^"https://a.test^"')).toBe(true);
		expect(isLikelyCurl('curl localhost:8080/health')).toBe(true);
		expect(isLikelyCurl('curl up with a book')).toBe(false);
		expect(isLikelyCurl('curly braces')).toBe(false);
		expect(isLikelyCurl('use curl to fetch')).toBe(false);
	});
});
