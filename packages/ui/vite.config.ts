import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { resolve } from "pathe";
import { readFileSync } from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		UnoCSS({
			presets: [
				presetUno(),
				presetAttributify(),
				presetIcons({
					collections: {
						carbon: () => JSON.parse(readFileSync("./node_modules/@iconify-json/carbon/icons.json", "utf-8")),
					},
				}),
			],
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
		}),
		Components({
			dirs: ["src/components"],
			dts: resolve(__dirname, "./src/components.d.ts"),
		}),
		AutoImport({
			dts: resolve(__dirname, "./src/auto-imports.d.ts"),
			imports: ["vue", "vue-router", "@vueuse/core"],
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
