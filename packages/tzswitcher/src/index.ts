import { definePgTExtension, type SchemaDefinition } from "@postgresql-typed/util";

import { checkValue } from "./util/checkValue.js";

const SCHEMA: SchemaDefinition = {
	$default: false,
	/* c8 ignore next 1 */
	$resolve: (value: unknown) => (typeof value === "object" ? value : false),

	$schema: {
		properties: {
			from: { type: "string" },
			to: { type: "string" },
		},
		required: ["from", "to"],
		type: "object",
	},
};

export default definePgTExtension<PgTTzSwitcherOptions>({
	meta: {
		configKey: "tzswitcher",
		name: "tzswitcher",
	},
	schema: {
		time: SCHEMA,
		timestamp: SCHEMA,
		timestamptz: SCHEMA,
		timetz: SCHEMA,
	},
	setup(resolvedOptions, manager) {
		const { timestamp, timestamptz, time, timetz } = resolvedOptions;

		/* c8 ignore next 1 */
		if (!timestamp && !timestamptz && !time && !timetz) return;

		manager.hook("pgt:pre-query", data => {
			data.input.values = checkValue(data.input.values, resolvedOptions, "from", "to");
		});

		manager.hook("pgt:post-query", data => {
			data.output.rows = checkValue(data.output.rows, resolvedOptions, "to", "from");
		});
	},
});

export interface PgTTzSwitcherOptions {
	/**
	 * Format a timestamp column to a different timezone
	 *
	 * @default false
	 */
	timestamp?: TzSwitcher | false;

	/**
	 * Format a timestamp with timezone column to a different timezone
	 *
	 * @default false
	 */
	timestamptz?: TzSwitcher | false;

	/**
	 * Format a time column to a different timezone
	 *
	 * @default false
	 */
	time?: TzSwitcher | false;

	/**
	 * Format a time with timezone column to a different timezone
	 *
	 * @default false
	 */
	timetz?: TzSwitcher | false;
}

export interface TzSwitcher {
	/**
	 * The timezone to convert from (What is stored in the database)
	 *
	 * @example "UTC"
	 */
	from: string;
	/**
	 * The timezone to convert to (What you want to use in your application)
	 *
	 * @example "America/New_York"
	 */
	to: string;
}
