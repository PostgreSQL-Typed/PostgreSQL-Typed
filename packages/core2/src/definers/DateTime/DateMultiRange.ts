/* eslint-disable unicorn/filename-case */
import { DateMultiRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTDateMultiRangeConfig<TMode extends "DateMultiRange" | "string" = "DateMultiRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers DateMultiRange
export type PgTDateMultiRangeBuilderInitial<TName extends string> = PgTDateMultiRangeBuilder<{
	name: TName;
	data: DateMultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateMultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateMultiRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateMultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTDateMultiRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTDateMultiRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateMultiRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateMultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateMultiRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers DateMultiRange as string
export type PgTDateMultiRangeStringBuilderInitial<TName extends string> = PgTDateMultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateMultiRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateMultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTDateMultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTDateMultiRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTDateMultiRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateMultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateMultiRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineDateMultiRange<TName extends string, TMode extends PgTDateMultiRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTDateMultiRangeConfig<TMode>
): Equal<TMode, "DateMultiRange"> extends true ? PgTDateMultiRangeBuilderInitial<TName> : PgTDateMultiRangeStringBuilderInitial<TName>;
export function defineDateMultiRange(name: string, config: PgTDateMultiRangeConfig = {}) {
	if (config.mode === "DateMultiRange") return new PgTDateMultiRangeBuilder(name, {});
	return new PgTDateMultiRangeStringBuilder(name, {});
}
