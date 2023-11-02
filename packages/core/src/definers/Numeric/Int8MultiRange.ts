import { Int8MultiRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

// MultiRange types were introduced in PostgreSQL 14, because we test against older versions, we need to skip coverage for this file
/* c8 ignore start */

export type PgTInt8MultiRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "Int8MultiRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int8MultiRange" ? Int8MultiRange : string,
	TDriverParameter = Int8MultiRange,
	TColumnType extends "PgTInt8MultiRange" = "PgTInt8MultiRange",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTInt8MultiRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
	columnType: TColumnType;
	dataType: TDataType;
	enumValues: TEnumValues;
}>;

//#region Int8MultiRange
export type PgTInt8MultiRangeBuilderInitial<TName extends string> = PgTInt8MultiRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt8MultiRange";
	data: Int8MultiRange;
	driverParam: Int8MultiRange;
	enumValues: undefined;
}>;

export class PgTInt8MultiRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt8MultiRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt8MultiRange");
	}

	/** @internal */
	build<TTableInt8MultiRange extends string>(table: AnyPgTable<{ name: TTableInt8MultiRange }>): PgTInt8MultiRange<MakeColumnConfig<T, TTableInt8MultiRange>> {
		return new PgTInt8MultiRange<MakeColumnConfig<T, TTableInt8MultiRange>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8MultiRange<T extends ColumnBaseConfig<"custom", "PgTInt8MultiRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8MultiRange";

	getSQLType(): string {
		return "int8multirange";
	}

	override mapFromDriverValue(value: Int8MultiRange): Int8MultiRange {
		return Int8MultiRange.from(value);
	}

	override mapToDriverValue(value: Int8MultiRange): Int8MultiRange {
		const result = Int8MultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTInt8MultiRangeStringBuilderInitial<TName extends string> = PgTInt8MultiRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTInt8MultiRangeString";
	data: string;
	driverParam: Int8MultiRange;
	enumValues: undefined;
}>;

export class PgTInt8MultiRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTInt8MultiRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTInt8MultiRangeString");
	}

	/** @internal */
	build<TTableInt8MultiRange extends string>(
		table: AnyPgTable<{ name: TTableInt8MultiRange }>
	): PgTInt8MultiRangeString<MakeColumnConfig<T, TTableInt8MultiRange>> {
		return new PgTInt8MultiRangeString<MakeColumnConfig<T, TTableInt8MultiRange>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8MultiRangeString<T extends ColumnBaseConfig<"string", "PgTInt8MultiRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeString";

	getSQLType(): string {
		return "int8multirange";
	}

	override mapFromDriverValue(value: Int8MultiRange): string {
		return Int8MultiRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): Int8MultiRange {
		const result = Int8MultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInt8MultiRange<TName extends string>(name: TName, config?: { mode: "string" }): PgTInt8MultiRangeStringBuilderInitial<TName>;
export function defineInt8MultiRange<TName extends string>(name: TName, config?: { mode: "Int8MultiRange" }): PgTInt8MultiRangeBuilderInitial<TName>;
export function defineInt8MultiRange<TName extends string>(name: TName, config?: { mode: "Int8MultiRange" | "string" }) {
	if (config?.mode === "Int8MultiRange") return new PgTInt8MultiRangeBuilder(name) as PgTInt8MultiRangeBuilderInitial<TName>;
	return new PgTInt8MultiRangeStringBuilder(name) as PgTInt8MultiRangeStringBuilderInitial<TName>;
}
