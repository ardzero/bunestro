import type { TSiteData, TtwitterMetaData, TMetadataIcons } from "@/types";

// edit the webmanifest file in /public to change the name, short_name, and icons in android
// in webmanifest, theme_color is the color of the app icon's background and
export const siteData: TSiteData = {
	favicon: "/favicon.svg", // .svg / .ico / .png
	name: "Bunestro - Astro v5 Bun Starter",
	shortName: "Bunestro",
	publisher: "bunestro.ardastroid.com",
	baseUrl: import.meta.env.SITE, // make sure to change the link in astro.config.mjs
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

	robotsDefault: "index, follow", // { index: false, follow: false }
};

// these are defaults may get overwrited in specific routes
export const twitterMetaData: TtwitterMetaData = {
	card: "summary_large_image",
	title: siteData.name,
	description: siteData.description,
	image: siteData.ogImage.src,
	creator: "@darkidop", //twitter username of author
};

// By default, it uses the favicon mentioned at the top
export const icons: TMetadataIcons = {
	icon: siteData.favicon, // "/favicon.svg",
	shortcut: siteData.favicon, // "/favicon-16x16.png",
	apple: siteData.favicon, // "/apple-touch-icon.png",
};
