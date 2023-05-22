import { defu } from "defu";
import { applyDefaults } from "untyped";

import type { PgTBaseClient } from "../types/PgTBaseClient.js";
import type { PgTExtension, PgTExtensionModuleDefinition, PgTExtensionOptions } from "../types/PgTExtension.js";
import type { PgTConfigSchema } from "./config/configs/index.js";

export function definePgTExtension<OptionsT extends PgTExtensionOptions>(definition: PgTExtensionModuleDefinition<OptionsT>): PgTExtension<OptionsT> {
	// Normalize definition and meta
	if (!definition.meta) definition.meta = {};

	if (definition.meta.configKey === undefined) definition.meta.configKey = definition.meta.name;

	// Resolves module options from inline options, [configKey] in nuxt.config, defaults and schema
	async function getOptions(pgt: PgTBaseClient<any, boolean>, inlineOptions?: OptionsT) {
		const configKey = definition.meta?.configKey || definition.meta?.name || "unknown",
			_defaults = definition.defaults instanceof Function ? definition.defaults(pgt) : definition.defaults;
		let _options = defu(inlineOptions, pgt.PgTConfig[configKey as keyof PgTConfigSchema], _defaults) as OptionsT;
		if (definition.schema) _options = (await applyDefaults(definition.schema, _options)) as OptionsT;

		return _options;
	}

	// Module format is always a simple function
	async function normalizedModule(this: any, inlineOptions: OptionsT, pgt: PgTBaseClient<any, boolean>) {
		// Resolve module and options
		const _options = await getOptions(pgt, inlineOptions);

		// eslint-disable-next-line unicorn/no-null
		await definition.setup?.call(null as any, _options, pgt);
	}

	// Define getters for options and meta
	normalizedModule.getMeta = () => Promise.resolve(definition.meta);
	normalizedModule.getOptions = getOptions;

	return normalizedModule as PgTExtension<OptionsT>;
}
