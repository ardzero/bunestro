// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	// must include https:// in the url
	site: "https://bunestro.ardastroid.com",
	integrations: [react(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-inter",
			weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
			fallbacks: ["sans-serif"],
		},

		{
			provider: fontProviders.local(),
			name: "Satoshi",
			cssVariable: "--font-satoshi",
			fallbacks: ["sans-serif"],
			options: {
				variants: [
					{
						weight: "300 900",
						style: "normal",
						display: "swap",
						src: [
							"./src/assets/fonts/Satoshi-Variable.woff2",
							"./src/assets/fonts/Satoshi-Variable.woff",
						],
					},
					{
						weight: "300 900",
						style: "italic",
						display: "swap",
						src: [
							"./src/assets/fonts/Satoshi-VariableItalic.woff2",
							"./src/assets/fonts/Satoshi-VariableItalic.woff",
						],
					},
				],
			},
		},
	],
});
