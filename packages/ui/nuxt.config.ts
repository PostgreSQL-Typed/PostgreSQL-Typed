import { readFileSync } from "node:fs";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	modules: ["@unocss/nuxt", "@vueuse/nuxt", "@nuxtjs/google-fonts"],
	app: {
		head: {
			title: "PostgreSQL-Typed",
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1.0",
			link: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg",
				},
			],
		},
	},
	googleFonts: {
		families: {
			"Readex+Pro": [400, 500],
		},
	},
	css: [
		"codemirror/lib/codemirror.css",
		"codemirror-theme-vars/base.css",
		"@/assets/main.css",
		"@unocss/reset/tailwind.css",
		"splitpanes/dist/splitpanes.css",
		"floating-vue/dist/style.css",
		"uno.css",
	],
	//buildModules: ["floating-vue/nuxt"],
	unocss: {
		// presets
		uno: true, // enabled `@unocss/preset-uno`
		icons: {
			collections: {
				carbon: () => JSON.parse(readFileSync("./node_modules/@iconify-json/carbon/icons.json", "utf-8")),
			},
		}, // enabled `@unocss/preset-icons`
		attributify: true, // enabled `@unocss/preset-attributify`,

		// core options
		shortcuts: {
			"bg-base": "bg-white dark:bg-[#111]",
			"bg-overlay": "bg-[#eee]:50 dark:bg-[#222]:50",
			"bg-header": "bg-gray-500:5",
			"bg-active": "bg-gray-500:8",
			"bg-hover": "bg-gray-500:20",
			"border-base": "border-gray-500:10",

			"tab-button": "font-light op50 hover:op80 h-full px-4",
			"tab-button-active": "op100 bg-gray-500:10",
		},
	},
});
