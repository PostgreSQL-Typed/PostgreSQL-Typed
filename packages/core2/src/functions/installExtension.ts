import type { PgTConfigSchema, PgTExtension, PgTExtensionOptions } from "@postgresql-typed/util";
import { normalize } from "pathe";
import { resolveAlias as _resolveAlias } from "pathe/utils";

import { PgTExtensionManager } from "../extensions.js";
import { importModule } from "./importModule.js";
import { requireModule } from "./requireModule.js";

/* c8 ignore start */
// This is being tested by the extensions packages

export async function installExtension(
	config: PgTConfigSchema,
	manager: PgTExtensionManager,
	moduleToInstall: string | PgTExtension,
	_inlineOptions?: PgTExtensionOptions
) {
	const { extension, inlineOptions } = await normalizeModule(config, moduleToInstall, _inlineOptions);
	// Call extension
	await extension(inlineOptions, manager);
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
				(await importModule(source, config.core.modulesDir).catch(() => undefined)) ?? requireModule(source, { paths: config.core.modulesDir });
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
	if (!alias) alias = config.core.alias || {};
	return _resolveAlias(path, alias);
}
