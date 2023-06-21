/* eslint-disable unicorn/filename-case */
import { TimestampRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTTimestampRangeConfig<TMode extends "TimestampRange" | "string" = "TimestampRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers TimestampRange
export type PgTTimestampRangeBuilderInitial<TName extends string> = PgTTimestampRangeBuilder<{
	name: TName;
	data: TimestampRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampRange as string
export type PgTTimestampRangeStringBuilderInitial<TName extends string> = PgTTimestampRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTimestampRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampRange<TName extends string, TMode extends PgTTimestampRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimestampRangeConfig<TMode>
): Equal<TMode, "TimestampRange"> extends true ? PgTTimestampRangeBuilderInitial<TName> : PgTTimestampRangeStringBuilderInitial<TName>;
export function defineTimestampRange(name: string, config: PgTTimestampRangeConfig = {}) {
	if (config.mode === "TimestampRange") return new PgTTimestampRangeBuilder(name, {});
	return new PgTTimestampRangeStringBuilder(name, {});
}
