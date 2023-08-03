import { definePgTExtension, PgTExtensionContext, PostQueryHookData } from "@postgresql-typed/util";
import { parse, stringify } from "json-buffer";
import Keyv from "keyv";
import { hash } from "ohash";

import { deserializer } from "./util/deserializer.js";
import { serializer } from "./util/serializer.js";

export default definePgTExtension<PgTCacheOptions>({
	meta: {
		configKey: "cache",
		name: "cache",
	},
	/* c8 ignore next 27 */
	//? Can't really test the config schema, since it's only used in the setup function
	schema: {
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
		uri: {
			$resolve: value => (typeof value === "string" ? value : undefined),
			$schema: {
				type: "string",
			},
		},
	},

	setup(resolvedOptions, manager) {
		const { uri, namespace, ttl, types } = resolvedOptions,
			keyv = new Keyv<PostQueryHookData["output"]>({
				deserialize: data => deserializer(parse(data)),
				namespace,
				serialize: data => stringify(serializer(data)),
				ttl,
				uri,
			});

		manager.hook("pgt:pre-query", async data => {
			//* If another hook has already set the output, don't do anything
			/* c8 ignore next 1 */
			if (data.output) return;

			const context = defaultContext(data.context, ttl);

			if (!context.cache?.enabled) return;
			if (!(types as string[]).includes(data.input.query.text.trim().split(" ")[0].toLowerCase())) return;

			const key = context.cache?.key ?? hash(data.input, {}),
				foundCache = await keyv.get(key);

			if (foundCache !== undefined) data.output = foundCache;

			context.cache.key = key;
			context.cache.cache = foundCache;
		});

		manager.hook("pgt:post-query", async data => {
			const context = defaultContext(data.context, ttl);

			if (!context.cache?.enabled) return;
			if (!(types as string[]).includes(data.input.query.text.trim().split(" ")[0].toLowerCase())) return;

			/* c8 ignore next 1 */
			const key = context.cache?.key ?? hash(data.input, {}),
				isCached = await keyv.has(key);

			if (!isCached) await keyv.set(key, data.output, context.cache?.ttl);

			context.cache.key = key;
			context.cache.cache = data.output;
		});
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

export interface PgTCacheContext {
	/**
	 * Whether the query should be cached.
	 *
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * The TTL for the cache.
	 *
	 * Set to `0` to disable TTL.
	 *
	 * @default "What was set in the config file"
	 */
	ttl?: number;
	/**
	 * The key to use for the cache.
	 *
	 * If not provided, the key will be generated from the query.
	 *
	 * @default undefined
	 */
	key?: string;
	/**
	 * Do NOT set this manually.
	 *
	 * This is set by the extension to the cached value.
	 *
	 * @default undefined
	 */
	cache?: PostQueryHookData["output"];
}

function defaultContext(contextt: PgTExtensionContext, ttl?: number): PgTExtensionContext & { cache?: PgTCacheContext } {
	const context = contextt as PgTExtensionContext & { cache?: PgTCacheContext };
	context.cache ??= {};
	context.cache.enabled ??= true;
	context.cache.ttl ??= ttl;
	return context;
}
