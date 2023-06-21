/* eslint-disable unicorn/filename-case */
import { DateRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTDateRangeConfig<TMode extends "DateRange" | "string" = "DateRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers DateRange
export type PgTDateRangeBuilderInitial<TName extends string> = PgTDateRangeBuilder<{
	name: TName;
	data: DateRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateRange<MakeColumnConfig<T, TTableName>> {
		return new PgTDateRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTDateRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers DateRange as string
export type PgTDateRangeStringBuilderInitial<TName extends string> = PgTDateRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTDateRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTDateRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineDateRange<TName extends string, TMode extends PgTDateRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTDateRangeConfig<TMode>
): Equal<TMode, "DateRange"> extends true ? PgTDateRangeBuilderInitial<TName> : PgTDateRangeStringBuilderInitial<TName>;
export function defineDateRange(name: string, config: PgTDateRangeConfig = {}) {
	if (config.mode === "DateRange") return new PgTDateRangeBuilder(name, {});
	return new PgTDateRangeStringBuilder(name, {});
}
