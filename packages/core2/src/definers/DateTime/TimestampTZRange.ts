/* eslint-disable unicorn/filename-case */
import { TimestampTZRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTTimestampTZRangeConfig<TMode extends "TimestampTZRange" | "string" = "TimestampTZRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers TimestampTZRange
export type PgTTimestampTZRangeBuilderInitial<TName extends string> = PgTTimestampTZRangeBuilder<{
	name: TName;
	data: TimestampTZRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampTZRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampTZRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampTZRange as string
export type PgTTimestampTZRangeStringBuilderInitial<TName extends string> = PgTTimestampTZRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampTZRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampTZRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampTZRange<TName extends string, TMode extends PgTTimestampTZRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimestampTZRangeConfig<TMode>
): Equal<TMode, "TimestampTZRange"> extends true ? PgTTimestampTZRangeBuilderInitial<TName> : PgTTimestampTZRangeStringBuilderInitial<TName>;
export function defineTimestampTZRange(name: string, config: PgTTimestampTZRangeConfig = {}) {
	if (config.mode === "TimestampTZRange") return new PgTTimestampTZRangeBuilder(name, {});
	return new PgTTimestampTZRangeStringBuilder(name, {});
}
