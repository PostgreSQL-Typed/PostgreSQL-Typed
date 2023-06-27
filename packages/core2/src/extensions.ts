import { ClientHooks, loadPgTConfig, PgTConfigSchema, PgTExtensionsManagerType } from "@postgresql-typed/util";
import { Hookable } from "hookable";

import { installExtension } from "./functions/installExtension.js";

export class PgTExtensionManager extends Hookable<ClientHooks> implements PgTExtensionsManagerType {
	initialized = false;
	private _config = {} as PgTConfigSchema;

	constructor() {
		super();
	}

	async initialize(): Promise<void> {
		if (this.initialized) return;

		const { config } = await loadPgTConfig(),
			{ extensions } = config.core;

		this._config = config;

		if (extensions.length === 0) {
			this.initialized = true;
			return;
		}

		for (const extension of extensions) {
			if (!extension) continue;
			await (Array.isArray(extension) ? installExtension(config, this, extension[0], extension[1]) : installExtension(config, this, extension, {}));
		}

		this.initialized = true;
	}

	get PgTConfig(): PgTConfigSchema {
		return this._config;
	}
}
