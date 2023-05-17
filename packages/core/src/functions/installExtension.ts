import type { PgTConfigSchema, PgTExtension, PgTExtensionOptions } from "@postgresql-typed/util";
import { normalize } from "pathe";
import { resolveAlias as _resolveAlias } from "pathe/utils";

import type { BaseClient } from "../classes/BaseClient.js";
import { importExtension } from "./importExtension.js";
import { requireExtension } from "./requireExtension.js";

export async function installExtension(
	config: PgTConfigSchema,
	pgt: BaseClient<any, boolean>,
	moduleToInstall: string | PgTExtension,
	_inlineOptions?: PgTExtensionOptions
) {
	const { extension, inlineOptions } = await normalizeModule(config, moduleToInstall, _inlineOptions);
	// Call extension
	await extension(inlineOptions, pgt);
}

async function normalizeModule(
	config: PgTConfigSchema,
	pgtExtension: string | PgTExtension,
	inlineOptions?: PgTExtensionOptions
): Promise<{ extension: PgTExtension<any>; inlineOptions?: PgTExtensionOptions }> {
	// Import if input is string
	if (typeof pgtExtension === "string") {
		const source = normalize(resolveAlias(config, pgtExtension));
		try {
			// Prefer ESM resolution if possible
			pgtExtension =
				// eslint-disable-next-line unicorn/no-useless-undefined
				(await importExtension(source, config.modulesDir).catch(() => undefined)) ?? requireExtension(source, { paths: config.modulesDir });
		} catch (error: unknown) {
			// eslint-disable-next-line no-console
			console.error(`Error while requiring module \`${pgtExtension}\`: ${error}`);
			throw error;
		}
	}

	// Throw error if input is not a function
	if (typeof pgtExtension !== "function") throw new TypeError(`PostgreSQL-Typed Extension should be a function: ${pgtExtension}`);

	return { extension: pgtExtension, inlineOptions };
}

function resolveAlias(config: PgTConfigSchema, path: string, alias?: Record<string, string>): string {
	if (!alias) alias = config.alias || {};
	return _resolveAlias(path, alias);
}
