import type { Component } from 'svelte';
import JsonFormatterTool from './JsonFormatterTool.svelte';
import Base64Tool from './Base64Tool.svelte';
import TimestampTool from './TimestampTool.svelte';
import JwtTool from './JwtTool.svelte';
import RegexTool from './RegexTool.svelte';
import DiffTool from './DiffTool.svelte';
import UrlTool from './UrlTool.svelte';
import UrlParserTool from './UrlParserTool.svelte';
import UuidTool from './UuidTool.svelte';
import HashTool from './HashTool.svelte';
import ColorTool from './ColorTool.svelte';

export const TOOL_COMPONENTS: Record<string, Component> = {
	'json-formatter': JsonFormatterTool,
	'base64-decode': Base64Tool,
	'timestamp-converter': TimestampTool,
	'jwt-decoder': JwtTool,
	'regex-tester': RegexTool,
	'diff-checker': DiffTool,
	'url-encode-decode': UrlTool,
	'url-parser': UrlParserTool,
	'uuid-generator': UuidTool,
	'hash-generator': HashTool,
	'color-converter': ColorTool
};
