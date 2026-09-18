/// <reference types="bun" />
/**
 * Rasterize public/favicon.svg into the 2026 favicon / PWA set in public/favicons/.
 *
 * Why these files:
 * - SVG at /favicon.svg: source + crisp modern-browser tab icon (not used by Google Search)
 * - ICO 16/32/48: /favicons/favicon.ico, plus /favicon.ico rewrite for scrapers
 * - PNG 32 + 48: Google Search wants a square raster, preferably >48px
 *   (BMP/GIF/ICO/PNG/JPEG; no SVG). 48px PNG is the SEO-safe pick.
 * - apple-touch-icon 180 + android-chrome 192/512: transparent PNGs
 * - 512 maskable PNG: opaque plate, logo in the inner 80% (Android adaptive)
 *
 * Usage: bun scripts/generate-icons.ts
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const FAVICONS_DIR = join(PUBLIC_DIR, "favicons");
const SOURCE_SVG = join(PUBLIC_DIR, "favicon.svg");

/** Only used for the maskable plate. White mark needs an opaque dark field. */
const MASKABLE_BG = "#0a0a0a";
const SVG_VIEWBOX = 192;
const MASKABLE_SAFE_RATIO = 0.8;
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

type PngTarget = {
	file: string;
	size: number;
	maskable?: boolean;
};

const PNG_TARGETS: PngTarget[] = [
	{ file: "favicon-16x16.png", size: 16 },
	{ file: "favicon-32x32.png", size: 32 },
	{ file: "favicon-48x48.png", size: 48 },
	{ file: "apple-touch-icon.png", size: 180 },
	{ file: "android-chrome-192x192.png", size: 192 },
	{ file: "android-chrome-512x512.png", size: 512 },
	{ file: "android-chrome-512x512-maskable.png", size: 512, maskable: true },
];

const ICO_SIZES = [16, 32, 48] as const;

const u16le = (n: number): Uint8Array => {
	const b = new Uint8Array(2);
	b[0] = n & 0xff;
	b[1] = (n >>> 8) & 0xff;
	return b;
};

const u32le = (n: number): Uint8Array => {
	const b = new Uint8Array(4);
	b[0] = n & 0xff;
	b[1] = (n >>> 8) & 0xff;
	b[2] = (n >>> 16) & 0xff;
	b[3] = (n >>> 24) & 0xff;
	return b;
};

/** PNG-in-ICO container (Vista+). Layers: 16, 32, 48. */
const encodeIco = (images: { size: number; png: Uint8Array }[]): Uint8Array => {
	const count = images.length;
	const headerSize = 6;
	const entrySize = 16;
	const offset0 = headerSize + entrySize * count;

	let cursor = offset0;
	const offsets: number[] = [];
	for (const image of images) {
		offsets.push(cursor);
		cursor += image.png.length;
	}

	const out = new Uint8Array(cursor);
	out.set(u16le(0), 0);
	out.set(u16le(1), 2);
	out.set(u16le(count), 4);

	for (let i = 0; i < count; i++) {
		const entry = headerSize + i * entrySize;
		const dim = images[i].size >= 256 ? 0 : images[i].size;
		out[entry] = dim;
		out[entry + 1] = dim;
		out[entry + 2] = 0;
		out[entry + 3] = 0;
		out.set(u16le(1), entry + 4);
		out.set(u16le(32), entry + 6);
		out.set(u32le(images[i].png.length), entry + 8);
		out.set(u32le(offsets[i]), entry + 12);
		out.set(images[i].png, offsets[i]);
	}

	return out;
};

const toUint8 = (data: Buffer | Uint8Array): Uint8Array =>
	data instanceof Uint8Array ? data : new Uint8Array(data);

const renderPng = async (svg: Buffer, size: number): Promise<Uint8Array> => {
	const density = (72 * size) / SVG_VIEWBOX;
	return toUint8(
		await sharp(svg, { density })
			.resize(size, size, { fit: "contain", background: TRANSPARENT })
			.png({ compressionLevel: 9 })
			.toBuffer(),
	);
};

const renderMaskablePng = async (
	svg: Buffer,
	size: number,
): Promise<Uint8Array> => {
	const inner = Math.round(size * MASKABLE_SAFE_RATIO);
	const offset = Math.round((size - inner) / 2);
	const mark = await renderPng(svg, inner);

	return toUint8(
		await sharp({
			create: {
				width: size,
				height: size,
				channels: 4,
				background: MASKABLE_BG,
			},
		})
			.composite([{ input: Buffer.from(mark), left: offset, top: offset }])
			.flatten({ background: MASKABLE_BG })
			.removeAlpha()
			.png({ compressionLevel: 9 })
			.toBuffer(),
	);
};

const formatBytes = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`;
	return `${(bytes / 1024).toFixed(1)} KB`;
};

const main = async () => {
	const source = Bun.file(SOURCE_SVG);
	if (!(await source.exists())) {
		throw new Error(`Missing source SVG at ${SOURCE_SVG}`);
	}

	const svg = Buffer.from(await source.arrayBuffer());
	await mkdir(FAVICONS_DIR, { recursive: true });

	console.log(`Source: ${SOURCE_SVG}\n`);

	const written: { file: string; bytes: number }[] = [];

	for (const target of PNG_TARGETS) {
		const png = target.maskable
			? await renderMaskablePng(svg, target.size)
			: await renderPng(svg, target.size);
		const dest = join(FAVICONS_DIR, target.file);
		await Bun.write(dest, png);
		written.push({ file: target.file, bytes: png.byteLength });
		console.log(
			`  ${target.file.padEnd(42)} ${String(target.size).padStart(3)}px  ${target.maskable ? "maskable" : "alpha   "}  ${formatBytes(png.byteLength)}`,
		);
	}

	const icoLayers = await Promise.all(
		ICO_SIZES.map(async (size) => ({
			size,
			png: await renderPng(svg, size),
		})),
	);
	const ico = encodeIco(icoLayers);
	await Bun.write(join(FAVICONS_DIR, "favicon.ico"), ico);
	written.push({ file: "favicon.ico", bytes: ico.byteLength });
	console.log(
		`  ${"favicon.ico".padEnd(42)} ${ICO_SIZES.join("/")}  ico      ${formatBytes(ico.byteLength)}`,
	);

	const total = written.reduce((sum, file) => sum + file.bytes, 0);
	console.log(`\nWrote ${written.length} files (${formatBytes(total)}) to public/favicons/`);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
