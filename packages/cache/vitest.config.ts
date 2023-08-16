import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			100: true,
			reportOnFailure: true,
			reporter: ["json-summary", "text", "html"],
		},
		deps: {
			interopDefault: true,
		},
	},
});
