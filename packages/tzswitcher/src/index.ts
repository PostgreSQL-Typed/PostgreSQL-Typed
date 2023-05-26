import { definePgTExtension, type SchemaDefinition } from "@postgresql-typed/util";

import { checkValue } from "./util/checkValue.js";

const SCHEMA: SchemaDefinition = {
	$default: false,
	$schema: {
		type: "object",
		properties: {
			from: { type: "string" },
			to: { type: "string" },
		},
		required: ["from", "to"],
	},
	/* c8 ignore next 1 */
	$resolve: (value: unknown) => (typeof value === "object" ? value : false),
};

export default definePgTExtension<PgTTzSwitcherOptions>({
	meta: {
		name: "tzswitcher",
		configKey: "tzswitcher",
	},
	setup(resolvedOptions, pgt) {
		const { timestamp, timestamptz, time, timetz } = resolvedOptions;

		/* c8 ignore next 1 */
		if (!timestamp && !timestamptz && !time && !timetz) return;

		pgt.hook("client:pre-query", data => {
			data.input.values = checkValue(data.input.values, resolvedOptions, "from", "to");
		});

		pgt.hook("client:post-query", data => {
			data.output.rows = checkValue(data.output.rows, resolvedOptions, "to", "from");
		});
	},
	schema: {
		timestamp: SCHEMA,
		timestamptz: SCHEMA,
		time: SCHEMA,
		timetz: SCHEMA,
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
