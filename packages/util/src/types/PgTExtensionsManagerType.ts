import type { Hookable } from "hookable";

import type { PgTConfigSchema } from "../util/config/configs/index.js";
import type { ClientHooks } from "./ClientHooks.js";

export interface PgTExtensionsManagerType extends Hookable<ClientHooks> {
	initialized: boolean;
	initialize(): Promise<void>;
	get PgTConfig(): PgTConfigSchema;
}
