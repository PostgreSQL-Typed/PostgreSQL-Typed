import { definePgTExtension } from "@postgresql-typed/util";

export default definePgTExtension({
	meta: {
		name: "cache",
		configKey: "cache",
	},
	setup(resolvedOptions, pgt) {
		console.log("Setup cache extension", resolvedOptions);
		pgt.hook("client:pre-query", data => {
			if (data.output) return;

			console.log("pre-query", data);
		});

		pgt.hook("client:post-query", data => {
			console.log("post-query", data);
		});
	},
});

export interface PgTCacheOptions {
	uri: string;
}

declare module "@postgresql-typed/util" {
	interface PgTConfigSchema {
		cache?: PgTCacheOptions;
	}
}
