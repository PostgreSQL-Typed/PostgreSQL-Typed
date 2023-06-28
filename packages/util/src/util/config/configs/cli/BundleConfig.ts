import { defineUntypedSchema, SchemaDefinition } from "untyped";

export interface BundleConfig {
	/**
	 * Whether to bundle the generated code into a single file (per database)
	 *
	 * @default false
	 */
	enabled: boolean;

	/**
	 * What should the bundle file be called
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 * - `DATE`: The current date (YYYY-MM-DD)
	 * - `TIME`: The current time (HH:MM:SS.sss)
	 * - `TIMESTAMP`: The current timestamp (YYYY-MM-DD_HH:MM:SS.sss)
	 * - `YEAR`: The current year (YYYY)
	 * - `MONTH`: The current month (MM)
	 * - `DAY`: The current day (DD)
	 * - `HOUR`: The current hour (HH)
	 * - `MINUTE`: The current minute (MM)
	 * - `SECOND`: The current second (SS)
	 * - `MILLISECOND`: The current millisecond (sss)
	 *
	 * Note: The timestamp is in UTC time
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}.ts"
	 */
	bundleFileName: string;
}

const schema: SchemaDefinition = defineUntypedSchema({
	enabled: {
		$default: false,
		$resolve: Boolean,
	},
	bundleFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}.ts"),
	},
});
export default schema;
