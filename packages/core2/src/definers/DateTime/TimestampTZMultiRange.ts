/* eslint-disable unicorn/filename-case */
import { TimestampTZMultiRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTTimestampTZMultiRangeConfig<TMode extends "TimestampTZMultiRange" | "string" = "TimestampTZMultiRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers TimestampTZMultiRange
export type PgTTimestampTZMultiRangeBuilderInitial<TName extends string> = PgTTimestampTZMultiRangeBuilder<{
	name: TName;
	data: TimestampTZMultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZMultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZMultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZMultiRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampTZMultiRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZMultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampTZMultiRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampTZMultiRange as string
export type PgTTimestampTZMultiRangeStringBuilderInitial<TName extends string> = PgTTimestampTZMultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZMultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZMultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampTZMultiRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZMultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampTZMultiRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampTZMultiRange<TName extends string, TMode extends PgTTimestampTZMultiRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimestampTZMultiRangeConfig<TMode>
): Equal<TMode, "TimestampTZMultiRange"> extends true ? PgTTimestampTZMultiRangeBuilderInitial<TName> : PgTTimestampTZMultiRangeStringBuilderInitial<TName>;
export function defineTimestampTZMultiRange(name: string, config: PgTTimestampTZMultiRangeConfig = {}) {
	if (config.mode === "TimestampTZMultiRange") return new PgTTimestampTZMultiRangeBuilder(name, {});
	return new PgTTimestampTZMultiRangeStringBuilder(name, {});
}
