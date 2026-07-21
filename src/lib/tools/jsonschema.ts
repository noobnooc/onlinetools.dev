import { type ToolResult, ok, err } from './types';
import Ajv from 'ajv';

/* ---------- schema inference ---------- */

type JsonSchema = Record<string, unknown>;

function mergeTypes(schemas: JsonSchema[]): JsonSchema {
	if (schemas.length === 0) return {};
	const first = JSON.stringify(schemas[0]);
	if (schemas.every((s) => JSON.stringify(s) === first)) return schemas[0];
	// Merge object schemas key-wise when every member is an object schema.
	if (schemas.every((s) => s.type === 'object')) {
		const allKeys = new Set<string>();
		for (const s of schemas) {
			for (const k of Object.keys((s.properties as JsonSchema) ?? {})) allKeys.add(k);
		}
		const properties: JsonSchema = {};
		const required: string[] = [];
		for (const key of allKeys) {
			const members = schemas
				.map((s) => ((s.properties as JsonSchema) ?? {})[key])
				.filter((v): v is JsonSchema => v !== undefined);
			properties[key] = mergeTypes(members);
			if (schemas.every((s) => (s.required as string[] | undefined)?.includes(key))) {
				required.push(key);
			}
		}
		const merged: JsonSchema = { type: 'object', properties };
		if (required.length > 0) merged.required = required.sort();
		return merged;
	}
	const types = [...new Set(schemas.map((s) => s.type).filter((t): t is string => typeof t === 'string'))];
	return { type: types.length === 1 ? types[0] : types };
}

function schemaOf(value: unknown): JsonSchema {
	if (value === null) return { type: 'null' };
	if (Array.isArray(value)) {
		if (value.length === 0) return { type: 'array', items: {} };
		return { type: 'array', items: mergeTypes(value.map(schemaOf)) };
	}
	switch (typeof value) {
		case 'string':
			return { type: 'string' };
		case 'boolean':
			return { type: 'boolean' };
		case 'number':
			return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
		case 'object': {
			const properties: JsonSchema = {};
			const required: string[] = [];
			for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
				properties[k] = schemaOf(v);
				required.push(k);
			}
			const s: JsonSchema = { type: 'object', properties };
			if (required.length > 0) s.required = required;
			return s;
		}
		default:
			return {};
	}
}

/** Infer a draft-07 JSON Schema from a JSON sample. */
export function inferJsonSchema(input: string, indent = 2): ToolResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (e) {
		return err(e instanceof Error ? e.message : 'Invalid JSON');
	}
	const schema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		...schemaOf(parsed)
	};
	return ok(JSON.stringify(schema, null, indent));
}

/* ---------- validation ---------- */

export interface SchemaViolation {
	path: string;
	message: string;
}

export function validateAgainstSchema(json: string, schemaText: string): ToolResult<SchemaViolation[]> {
	let data: unknown;
	try {
		data = JSON.parse(json);
	} catch (e) {
		return err('Data: ' + (e instanceof Error ? e.message : 'invalid JSON'));
	}
	let schema: JsonSchema;
	try {
		schema = JSON.parse(schemaText);
	} catch (e) {
		return err('Schema: ' + (e instanceof Error ? e.message : 'invalid JSON'));
	}
	try {
		const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
		const validate = ajv.compile(schema);
		const valid = validate(data);
		if (valid) return ok([]);
		const violations: SchemaViolation[] = (validate.errors ?? []).map((e) => ({
			path: e.instancePath === '' ? '$' : '$' + e.instancePath.replace(/\//g, '.'),
			message: e.message ?? 'violates schema'
		}));
		return ok(violations);
	} catch (e) {
		return err('Schema: ' + (e instanceof Error ? e.message.split('\n')[0] : 'could not compile'));
	}
}
