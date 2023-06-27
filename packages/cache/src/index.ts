import { definePgTExtension, PostQueryHookData } from "@postgresql-typed/util";
import { parse, stringify } from "json-buffer";
import Keyv from "keyv";
import { hash } from "ohash";

import { deserializer } from "./util/deserializer.js";
import { serializer } from "./util/serializer.js";

export default definePgTExtension<PgTCacheOptions>({
	meta: {
		name: "cache",
		configKey: "cache",
	},
	setup(resolvedOptions, manager) {
		const { uri, namespace, ttl, types } = resolvedOptions,
			keyv = new Keyv<PostQueryHookData["output"]>({
				uri,
				namespace,
				ttl,
				serialize: data => stringify(serializer(data)),
				deserialize: data => deserializer(parse(data)),
			});

		manager.hook("pgt:pre-query", async data => {
			//* If another hook has already set the output, don't do anything
			/* c8 ignore next 1 */
			if (data.output) return;

			if (!(types as string[]).includes(data.input.query.text.trim().split(" ")[0].toLowerCase())) return;

			const hashed = hash(data.input, {}),
				foundCache = await keyv.get(hashed);

			if (foundCache !== undefined) data.output = foundCache;
		});

		manager.hook("pgt:post-query", async data => {
			if (!(types as string[]).includes(data.input.query.text.trim().split(" ")[0].toLowerCase())) return;

			const hashed = hash(data.input, {}),
				isCached = await keyv.has(hashed);

			if (!isCached) await keyv.set(hashed, data.output);
		});
	},
	/* c8 ignore next 27 */
	//? Can't really test the config schema, since it's only used in the setup function
	schema: {
		uri: {
			$schema: {
				type: "string",
			},
			$resolve: value => (typeof value === "string" ? value : undefined),
		},
		namespace: {
			$default: "pgt",
			$resolve: value => (typeof value === "string" ? value : "pgt"),
		},
		ttl: {
			$default: 1000 * 60 * 15,
			$resolve: value => (typeof value === "number" ? value : 1000 * 60 * 15),
		},
		types: {
			$default: ["select"],
			$resolve: value => {
				if (!Array.isArray(value)) return ["select"];
				const allowed = new Set(["select", "insert", "update", "delete"]);
				value = value.filter(Boolean).map(type => type.toLowerCase());
				for (const type of value) if (!allowed.has(type)) return ["select"];
				return value;
			},
		},
	},
});

export interface PgTCacheOptions {
	/**
	 * The connection string URI.
	 */
	uri?: string;
	/**
	 * The namespace to use for the cache.
	 *
	 * @default "pgt"
	 */
	namespace?: string;
	/**
	 * The TTL for the cache.
	 *
	 * Set to `0` to disable TTL.
	 *
	 * @default 1000 * 60 * 15 // (15 minutes)
	 */
	ttl?: number;
	/**
	 * The types of queries to cache.
	 *
	 * @default ["select"]
	 */
	types?: ("select" | "insert" | "update" | "delete")[];
}
