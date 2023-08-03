import { defineUntypedSchema, SchemaDefinition } from "untyped";

export interface DefinerModes {
	//* Binary
	bytea: "ByteA" | "string" | "Buffer";
	//* BitString
	/**
	 * The bit definer mode.
	 *
	 * @default "string"
	 */
	bit: "Bit" | "string" | "number";
	/**
	 * The bit varying definer mode.
	 *
	 * @default "string"
	 */
	bitVarying: "BitVarying" | "string" | "number";
	//* Boolean
	/**
	 * The boolean definer mode.
	 *
	 * @default "boolean"
	 */
	boolean: "Boolean" | "string" | "boolean" | "number";
	//* Character
	/**
	 * The character definer mode.
	 *
	 * @default "string"
	 */
	character: "Character" | "string";
	/**
	 * The character varying definer mode.
	 *
	 * @default "string"
	 */
	characterVarying: "CharacterVarying" | "string";
	/**
	 * The char definer mode.
	 *
	 * @default "string"
	 */
	name: "Name" | "string";
	/**
	 * The text definer mode.
	 *
	 * @default "string"
	 */
	text: "Text" | "string";
	//* DateTime
	/**
	 * The date definer mode.
	 *
	 * @default "globalThis.Date"
	 */
	date: "Date" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string";
	/**
	 * The date multi range definer mode.
	 *
	 * @default "string"
	 */
	dateMultiRange: "DateMultiRange" | "string";
	/**
	 * The date range definer mode.
	 *
	 * @default "string"
	 */
	dateRange: "DateRange" | "string";
	/**
	 * The interval definer mode.
	 *
	 * @default "string"
	 */
	interval: "Interval" | "string";
	/**
	 * The time definer mode.
	 *
	 * @default "globalThis.Date"
	 */
	time: "Time" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string";
	/**
	 * The timestamp definer mode.
	 *
	 * @default "globalThis.Date"
	 */
	timestamp: "Timestamp" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string";
	/**
	 * The timestamp multi range definer mode.
	 *
	 * @default "string"
	 */
	timestampMultiRange: "TimestampMultiRange" | "string";
	/**
	 * The timestamp range definer mode.
	 *
	 * @default "string"
	 */
	timestampRange: "TimestampRange" | "string";
	/**
	 * The timestamptz definer mode.
	 *
	 * @default "globalThis.Date"
	 */
	timestamptz: "TimestampTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string";
	/**
	 * The timestamptz multi range definer mode.
	 *
	 * @default "string"
	 */
	timestamptzMultiRange: "TimestampTZMultiRange" | "string";
	/**
	 * The timestamptz range definer mode.
	 *
	 * @default "string"
	 */
	timestamptzRange: "TimestampTZRange" | "string";
	/**
	 * The timetz definer mode.
	 *
	 * @default "globalThis.Date"
	 */
	timetz: "TimeTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string";
	/**
	 * The enum definer mode.
	 *
	 * @default "string"
	 */
	enum: "Enum" | "string";
	//* Geometric
	/**
	 * The box definer mode.
	 *
	 * @default "string"
	 */
	box: "Box" | "string";
	/**
	 * The circle definer mode.
	 *
	 * @default "string"
	 */
	circle: "Circle" | "string";
	/**
	 * The line definer mode.
	 *
	 * @default "string"
	 */
	line: "Line" | "string";
	/**
	 * The line segment definer mode.
	 *
	 * @default "string"
	 */
	lineSegment: "LineSegment" | "string";
	/**
	 * The path definer mode.
	 *
	 * @default "string"
	 */
	path: "Path" | "string";
	/**
	 * The point definer mode.
	 *
	 * @default "string"
	 */
	point: "Point" | "string";
	/**
	 * The polygon definer mode.
	 *
	 * @default "string"
	 */
	polygon: "Polygon" | "string";
	//* JSON
	/**
	 * The json definer mode.
	 *
	 * @default "value"
	 */
	json: "JSON" | "string" | "value";
	/**
	 * The jsonb definer mode.
	 *
	 * @default "value"
	 */
	jsonb: "JSON" | "string" | "value";
	//* Monetary
	/**
	 * The money definer mode.
	 *
	 * @default "number"
	 */
	money: "Money" | "string" | "BigNumber" | "number";
	//* Numeric
	/**
	 * The float4 definer mode.
	 *
	 * @default "number"
	 */
	float4: "Float4" | "string" | "BigNumber" | "number";
	/**
	 * The float8 definer mode.
	 *
	 * @default "number"
	 */
	float8: "Float8" | "string" | "BigNumber" | "number";
	/**
	 * The int2 definer mode.
	 *
	 * @default "number"
	 */
	int2: "Int2" | "string" | "number";
	/**
	 * The int4 definer mode.
	 *
	 * @default "number"
	 */
	int4: "Int4" | "string" | "number";
	/**
	 * The int4 multi range definer mode.
	 *
	 * @default "string"
	 */
	int4MultiRange: "Int4MultiRange" | "string";
	/**
	 * The int4 range definer mode.
	 *
	 * @default "string"
	 */
	int4Range: "Int4Range" | "string";
	/**
	 * The int8 definer mode.
	 *
	 * @default "number"
	 */
	int8: "Int8" | "string" | "BigInt" | "number";
	/**
	 * The int8 multi range definer mode.
	 *
	 * @default "string"
	 */
	int8MultiRange: "Int8MultiRange" | "string";
	/**
	 * The int8 range definer mode.
	 *
	 * @default "string"
	 */
	int8Range: "Int8Range" | "string";
	//* Object Identifier
	/**
	 * The oid definer mode.
	 *
	 * @default "number"
	 */
	oid: "OID" | "string" | "number";
	//* UUID
	/**
	 * The uuid definer mode.
	 *
	 * @default "string"
	 */
	uuid: "UUID" | "string";
}

const schema: SchemaDefinition = defineUntypedSchema({
	bytea: {
		$default: "Buffer",
		$resolve: (value: any) => (typeof value === "string" && ["ByteA", "Buffer", "string"].includes(value) ? value : "Buffer"),
	},
	bit: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Bit", "string", "number"].includes(value) ? value : "string"),
	},
	bitVarying: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["BitVarying", "string", "number"].includes(value) ? value : "string"),
	},
	boolean: {
		$default: "boolean",
		$resolve: (value: any) => (typeof value === "string" && ["Boolean", "string", "boolean", "number"].includes(value) ? value : "boolean"),
	},
	character: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Character", "string"].includes(value) ? value : "string"),
	},
	characterVarying: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["CharacterVarying", "string"].includes(value) ? value : "string"),
	},
	name: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Name", "string"].includes(value) ? value : "string"),
	},
	text: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Text", "string"].includes(value) ? value : "string"),
	},
	date: {
		$default: "globalThis.Date",
		$resolve: (value: any) =>
			typeof value === "string" && ["Date", "globalThis.Date", "luxon.DateTime", "unix", "string"].includes(value) ? value : "globalThis.Date",
	},
	dateMultiRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["DateMultiRange", "string"].includes(value) ? value : "string"),
	},
	dateRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["DateRange", "string"].includes(value) ? value : "string"),
	},
	interval: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Interval", "string"].includes(value) ? value : "string"),
	},
	time: {
		$default: "globalThis.Date",
		$resolve: (value: any) =>
			typeof value === "string" && ["Time", "globalThis.Date", "luxon.DateTime", "unix", "string"].includes(value) ? value : "globalThis.Date",
	},
	timestamp: {
		$default: "globalThis.Date",
		$resolve: (value: any) =>
			typeof value === "string" && ["Timestamp", "globalThis.Date", "luxon.DateTime", "unix", "string"].includes(value) ? value : "globalThis.Date",
	},
	timestampMultiRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["TimestampMultiRange", "string"].includes(value) ? value : "string"),
	},
	timestampRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["TimestampRange", "string"].includes(value) ? value : "string"),
	},
	timestamptz: {
		$default: "globalThis.Date",
		$resolve: (value: any) =>
			typeof value === "string" && ["TimestampTZ", "globalThis.Date", "luxon.DateTime", "unix", "string"].includes(value) ? value : "globalThis.Date",
	},
	timestamptzMultiRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["TimestampTZMultiRange", "string"].includes(value) ? value : "string"),
	},
	timestamptzRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["TimestampTZRange", "string"].includes(value) ? value : "string"),
	},
	timetz: {
		$default: "globalThis.Date",
		$resolve: (value: any) =>
			typeof value === "string" && ["TimeTZ", "globalThis.Date", "luxon.DateTime", "unix", "string"].includes(value) ? value : "globalThis.Date",
	},
	enum: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Enum", "string"].includes(value) ? value : "string"),
	},
	box: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Box", "string"].includes(value) ? value : "string"),
	},
	circle: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Circle", "string"].includes(value) ? value : "string"),
	},
	line: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Line", "string"].includes(value) ? value : "string"),
	},
	lineSegment: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["LineSegment", "string"].includes(value) ? value : "string"),
	},
	path: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Path", "string"].includes(value) ? value : "string"),
	},
	point: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Point", "string"].includes(value) ? value : "string"),
	},
	polygon: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Polygon", "string"].includes(value) ? value : "string"),
	},
	json: {
		$default: "value",
		$resolve: (value: any) => (typeof value === "string" && ["JSON", "string", "value"].includes(value) ? value : "value"),
	},
	jsonb: {
		$default: "value",
		$resolve: (value: any) => (typeof value === "string" && ["JSON", "string", "value"].includes(value) ? value : "value"),
	},
	money: {
		$default: "number",
		$resolve: (value: any) => (typeof value === "string" && ["Money", "string", "BigNumber", "number"].includes(value) ? value : "number"),
	},
	float4: {
		$default: "number",
		$resolve: (value: any) => (typeof value === "string" && ["Float4", "string", "BigNumber", "number"].includes(value) ? value : "number"),
	},
	float8: {
		$default: "number",
		$resolve: (value: any) => (typeof value === "string" && ["Float8", "string", "BigNumber", "number"].includes(value) ? value : "number"),
	},
	int2: {
		$default: "number",
		$resolve: (value: any) => (typeof value === "string" && ["Int2", "string", "number"].includes(value) ? value : "number"),
	},
	int4: {
		$default: "number",
		$resolve: (value: any) => (typeof value === "string" && ["Int4", "string", "number"].includes(value) ? value : "number"),
	},
	int4MultiRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Int4MultiRange", "string"].includes(value) ? value : "string"),
	},
	int4Range: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Int4Range", "string"].includes(value) ? value : "string"),
	},
	int8: {
		$default: "number",
		$resolve: (value: any) => (typeof value === "string" && ["Int8", "string", "BigInt", "number"].includes(value) ? value : "number"),
	},
	int8MultiRange: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Int8MultiRange", "string"].includes(value) ? value : "string"),
	},
	int8Range: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["Int8Range", "string"].includes(value) ? value : "string"),
	},
	oid: {
		$default: "number",
		$resolve: (value: any) => (typeof value === "string" && ["OID", "string", "number"].includes(value) ? value : "number"),
	},
	uuid: {
		$default: "string",
		$resolve: (value: any) => (typeof value === "string" && ["UUID", "string"].includes(value) ? value : "string"),
	},
});
export default schema;
