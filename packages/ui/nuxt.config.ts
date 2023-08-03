import { readFileSync } from "node:fs";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			charset: "utf8",
			link: [
				{
					href: "/favicon.svg",
					rel: "icon",
					type: "image/svg+xml",
				},
			],
			title: "PostgreSQL-Typed",
			viewport: "width=device-width, initial-scale=1.0",
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
	googleFonts: {
		families: {
			"Readex+Pro": [400, 500],
		},
	},
	modules: ["@unocss/nuxt", "@vueuse/nuxt", "@nuxtjs/google-fonts"],
	//buildModules: ["floating-vue/nuxt"],
	unocss: {
		// enabled `@unocss/preset-icons`
		attributify: true,

		// enabled `@unocss/preset-uno`
		icons: {
			collections: {
				carbon: () => JSON.parse(readFileSync("./node_modules/@iconify-json/carbon/icons.json", "utf8")),
			},
		},

		// enabled `@unocss/preset-attributify`,
		// core options
		shortcuts: {
			"bg-active": "bg-gray-500:8",
			"bg-base": "bg-white dark:bg-[#111]",
			"bg-header": "bg-gray-500:5",
			"bg-hover": "bg-gray-500:20",
			"bg-overlay": "bg-[#eee]:50 dark:bg-[#222]:50",
			"border-base": "border-gray-500:10",

			"tab-button": "font-light op50 hover:op80 h-full px-4",
			"tab-button-active": "op100 bg-gray-500:10",
		},

		// presets
		uno: true,
	},
});
