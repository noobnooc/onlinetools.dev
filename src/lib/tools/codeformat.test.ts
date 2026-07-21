import { describe, expect, it } from 'vitest';
import { beautifyCode, minifyCss, minifyHtml, minifyJs } from './codeformat';

describe('beautifyCode', () => {
	it('beautifies JavaScript', () => {
		const r = beautifyCode('js', 'function f(a,b){return a+b}');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value).toContain('function f(a, b) {');
	});
	it('beautifies CSS', () => {
		const r = beautifyCode('css', 'a{color:red;text-decoration:none}');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('a {');
			expect(r.value).toContain('color: red;');
		}
	});
	it('beautifies HTML', () => {
		const r = beautifyCode('html', '<div><p>hi</p><span>x</span></div>');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value.split('\n').length).toBeGreaterThan(1);
	});
});

describe('minifyCss', () => {
	it('strips comments and collapses whitespace', () => {
		const r = minifyCss('/* c */\na {\n  color: red;\n  margin: 0 auto;\n}\n');
		expect(r).toEqual({ ok: true, value: 'a{color:red;margin:0 auto}' });
	});
	it('preserves strings and url()', () => {
		const r = minifyCss('a::before { content: "two  spaces"; background: url( x.png ); }');
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.value).toContain('"two  spaces"');
	});
	it('keeps descendant combinator spaces', () => {
		const r = minifyCss('nav a { color: red; }');
		expect(r.ok && r.value.startsWith('nav a{')).toBe(true);
	});
});

describe('minifyHtml', () => {
	it('removes comments and collapses gaps', () => {
		const r = minifyHtml('<div>\n  <!-- gone -->\n  <p>hi</p>\n</div>');
		expect(r).toEqual({ ok: true, value: '<div><p>hi</p></div>' });
	});
	it('protects pre and script contents', () => {
		const src = '<pre>  keep\n  this  </pre><script>\nlet a = 1;\n</script>';
		const r = minifyHtml(src);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value).toContain('  keep\n  this  ');
			expect(r.value).toContain('let a = 1;');
		}
	});
});

describe('minifyJs', () => {
	it('minifies and mangles', async () => {
		const r = await minifyJs('function add(first, second) {\n  return first + second;\n}\nconsole.log(add(1, 2));');
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.length).toBeLessThan(80);
			expect(r.value).toContain('console.log');
		}
	});
	it('reports syntax errors', async () => {
		const r = await minifyJs('function {');
		expect(r.ok).toBe(false);
	});
});
