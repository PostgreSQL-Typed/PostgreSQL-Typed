/* eslint-disable unicorn/filename-case */
import { Int4Range } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTInt4RangeConfig<TMode extends "Int4Range" | "string" = "Int4Range" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Int4Range
export type PgTInt4RangeBuilderInitial<TName extends string> = PgTInt4RangeBuilder<{
	name: TName;
	data: Int4Range;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4RangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4RangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4Range<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4Range<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt4Range<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4Range";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4Range.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4Range.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4Range as string
export type PgTInt4RangeStringBuilderInitial<TName extends string> = PgTInt4RangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4RangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4RangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4RangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4RangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt4RangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4RangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4Range.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4Range.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt4Range<TName extends string, TMode extends PgTInt4RangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTInt4RangeConfig<TMode>
): Equal<TMode, "Int4Range"> extends true ? PgTInt4RangeBuilderInitial<TName> : PgTInt4RangeStringBuilderInitial<TName>;
export function defineInt4Range(name: string, config: PgTInt4RangeConfig = {}) {
	if (config.mode === "Int4Range") return new PgTInt4RangeBuilder(name, {});
	return new PgTInt4RangeStringBuilder(name, {});
}
