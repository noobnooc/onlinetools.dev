import { type ToolResult, ok, err } from './types';
import qrcodegen from 'qrcode-generator';

export type EcLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrResult {
	svg: string;
	moduleCount: number;
	/** Matrix for custom rendering: matrix[y][x] === dark. */
	matrix: boolean[][];
}

export function generateQr(text: string, ecLevel: EcLevel = 'M'): ToolResult<QrResult> {
	if (text === '') return err('Input is empty');
	if (new TextEncoder().encode(text).length > 2500) {
		return err('Content too long for a QR code (max ~2.5 KB)');
	}
	try {
		const qr = qrcodegen(0, ecLevel); // type 0 = auto-size
		qr.addData(text);
		qr.make();
		const n = qr.getModuleCount();
		const matrix: boolean[][] = [];
		for (let y = 0; y < n; y++) {
			const row: boolean[] = [];
			for (let x = 0; x < n; x++) row.push(qr.isDark(y, x));
			matrix.push(row);
		}
		const quiet = 4;
		const size = n + quiet * 2;
		let path = '';
		for (let y = 0; y < n; y++) {
			for (let x = 0; x < n; x++) {
				if (matrix[y][x]) path += `M${x + quiet},${y + quiet}h1v1h-1z`;
			}
		}
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/><path d="${path}" fill="#000000"/></svg>`;
		return ok({ svg, moduleCount: n, matrix });
	} catch (e) {
		return err(e instanceof Error ? e.message : 'QR generation failed');
	}
}
