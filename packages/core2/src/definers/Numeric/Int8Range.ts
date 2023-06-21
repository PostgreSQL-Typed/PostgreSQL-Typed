/* eslint-disable unicorn/filename-case */
import { Int8Range } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTInt8RangeConfig<TMode extends "Int8Range" | "string" = "Int8Range" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Int8Range
export type PgTInt8RangeBuilderInitial<TName extends string> = PgTInt8RangeBuilder<{
	name: TName;
	data: Int8Range;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8RangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8RangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8Range<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8Range<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8Range<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8Range";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8Range.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8Range.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8Range as string
export type PgTInt8RangeStringBuilderInitial<TName extends string> = PgTInt8RangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8RangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8RangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8RangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8RangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8RangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8RangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8Range.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8Range.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt8Range<TName extends string, TMode extends PgTInt8RangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTInt8RangeConfig<TMode>
): Equal<TMode, "Int8Range"> extends true ? PgTInt8RangeBuilderInitial<TName> : PgTInt8RangeStringBuilderInitial<TName>;
export function defineInt8Range(name: string, config: PgTInt8RangeConfig = {}) {
	if (config.mode === "Int8Range") return new PgTInt8RangeBuilder(name, {});
	return new PgTInt8RangeStringBuilder(name, {});
}
