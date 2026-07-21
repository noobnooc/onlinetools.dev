import { describe, expect, it } from 'vitest';
import { inferJsonSchema, validateAgainstSchema } from './jsonschema';

describe('inferJsonSchema', () => {
	it('infers object properties with required keys', () => {
		const r = inferJsonSchema('{"name": "Ada", "age": 36, "score": 1.5, "tags": ["a"]}');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const s = JSON.parse(r.value);
			expect(s.$schema).toContain('draft-07');
			expect(s.type).toBe('object');
			expect(s.properties.name.type).toBe('string');
			expect(s.properties.age.type).toBe('integer');
			expect(s.properties.score.type).toBe('number');
			expect(s.properties.tags).toEqual({ type: 'array', items: { type: 'string' } });
			expect(s.required).toContain('name');
		}
	});
	it('merges array member objects and drops non-universal required keys', () => {
		const r = inferJsonSchema('[{"id": 1, "note": "x"}, {"id": 2}]');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const s = JSON.parse(r.value);
			expect(s.items.properties.id.type).toBe('integer');
			expect(s.items.properties.note.type).toBe('string');
			expect(s.items.required).toEqual(['id']);
		}
	});
	it('handles mixed-type arrays', () => {
		const r = inferJsonSchema('[1, "two"]');
		expect(r.ok).toBe(true);
		if (r.ok) {
			const s = JSON.parse(r.value);
			expect(s.items.type).toEqual(expect.arrayContaining(['integer', 'string']));
		}
	});
	it('errors on invalid JSON', () => {
		expect(inferJsonSchema('{oops}').ok).toBe(false);
	});
});

describe('validateAgainstSchema', () => {
	const schema = JSON.stringify({
		type: 'object',
		properties: { name: { type: 'string' }, age: { type: 'integer', minimum: 0 } },
		required: ['name']
	});

	it('returns no violations for valid data', () => {
		expect(validateAgainstSchema('{"name": "Ada", "age": 36}', schema)).toEqual({
			ok: true,
			value: []
		});
	});
	it('lists violations with paths', () => {
		const r = validateAgainstSchema('{"age": -1}', schema);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(r.value.length).toBe(2);
			const paths = r.value.map((v) => v.path);
			expect(paths).toContain('$');
			expect(paths).toContain('$.age');
		}
	});
	it('validates an inferred schema against its own sample', () => {
		const sample = '{"a": [1, 2], "b": {"c": true}}';
		const inferred = inferJsonSchema(sample);
		expect(inferred.ok).toBe(true);
		if (inferred.ok) {
			expect(validateAgainstSchema(sample, inferred.value)).toEqual({ ok: true, value: [] });
		}
	});
	it('errors on invalid schema JSON', () => {
		expect(validateAgainstSchema('{}', '{nope').ok).toBe(false);
	});
});
