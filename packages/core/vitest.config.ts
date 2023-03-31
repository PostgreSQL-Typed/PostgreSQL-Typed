import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		deps: {
			interopDefault: true,
		},
		coverage: {
			100: true,
			reporter: ["json-summary", "text"],
		},
	},
});
