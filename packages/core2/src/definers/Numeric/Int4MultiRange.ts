/* eslint-disable unicorn/filename-case */
import { Int4MultiRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTInt4MultiRangeConfig<TMode extends "Int4MultiRange" | "string" = "Int4MultiRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Int4MultiRange
export type PgTInt4MultiRangeBuilderInitial<TName extends string> = PgTInt4MultiRangeBuilder<{
	name: TName;
	data: Int4MultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4MultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4MultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4MultiRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt4MultiRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4MultiRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4MultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4MultiRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4MultiRange as string
export type PgTInt4MultiRangeStringBuilderInitial<TName extends string> = PgTInt4MultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4MultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4MultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4MultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt4MultiRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4MultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4MultiRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt4MultiRange<TName extends string, TMode extends PgTInt4MultiRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTInt4MultiRangeConfig<TMode>
): Equal<TMode, "Int4MultiRange"> extends true ? PgTInt4MultiRangeBuilderInitial<TName> : PgTInt4MultiRangeStringBuilderInitial<TName>;
export function defineInt4MultiRange(name: string, config: PgTInt4MultiRangeConfig = {}) {
	if (config.mode === "Int4MultiRange") return new PgTInt4MultiRangeBuilder(name, {});
	return new PgTInt4MultiRangeStringBuilder(name, {});
}
