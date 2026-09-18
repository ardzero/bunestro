import type { TSiteData, TtwitterMetaData, TMetadataIcons } from "@/types";

// edit the webmanifest file in /public to change the name, short_name, and icons in android
// in webmanifest, theme_color is the color of the app icon's background and
export const siteData: TSiteData = {
	name: "Bunestro - Astro v5 Bun Starter",
	shortName: "Bunestro",
	publisher: "bunestro.ardastroid.com",
	baseUrl: import.meta.env.SITE, // make sure to change the link in astro.config.mjs (may show type err until dev server is running)
	description:
		"Bunestro is a astro v5 starter template with tailwindcss, shadcn and some other cool feature that runs on bun or node",
	ogImage: { src: "/ogImage.webp", alt: "Bunestro", width: 1200, height: 630 },
	metadata_color: {
		light: "#3A86FF",
		dark: "#3A86FF",
	},
	author: {
		name: "Ard Astroid",
		url: "https://github.com/ardzero/",
	},
	keywords: [
		"Astro.build",
		"React",
		"Tailwind CSS",
		"Bun",
		"Shadcn UI",
		"TypeScript",
		"Zod",
	],

	robotsDefault: { index: true, follow: false }, // { index: false, follow: false }
};

// regenerate with `bun run generate:icons` from favicon.svg in public folder
export const icons: TMetadataIcons = {
	icon: [
		{ url: "/favicon.svg", type: "image/svg+xml" },
		{ url: "/favicons/favicon.ico", sizes: "any" },
		{ url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		{ url: "/favicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
	],
	shortcut: "/favicons/favicon.ico",
	apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
};

// these are defaults may get overwrited in specific routes
export const twitterMetaData: TtwitterMetaData = {
	card: "summary_large_image",
	title: siteData.name,
	description: siteData.description,
	image: siteData.ogImage.src,
	creator: "@ardastroid", //twitter username of author
};

