/* eslint-disable unicorn/filename-case */
import { TimestampMultiRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTTimestampMultiRangeConfig<TMode extends "TimestampMultiRange" | "string" = "TimestampMultiRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers TimestampMultiRange
export type PgTTimestampMultiRangeBuilderInitial<TName extends string> = PgTTimestampMultiRangeBuilder<{
	name: TName;
	data: TimestampMultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampMultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampMultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampMultiRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampMultiRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampMultiRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampMultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampMultiRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampMultiRange as string
export type PgTTimestampMultiRangeStringBuilderInitial<TName extends string> = PgTTimestampMultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampMultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampMultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampMultiRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampMultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampMultiRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampMultiRange<TName extends string, TMode extends PgTTimestampMultiRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimestampMultiRangeConfig<TMode>
): Equal<TMode, "TimestampMultiRange"> extends true ? PgTTimestampMultiRangeBuilderInitial<TName> : PgTTimestampMultiRangeStringBuilderInitial<TName>;
export function defineTimestampMultiRange(name: string, config: PgTTimestampMultiRangeConfig = {}) {
	if (config.mode === "TimestampMultiRange") return new PgTTimestampMultiRangeBuilder(name, {});
	return new PgTTimestampMultiRangeStringBuilder(name, {});
}
