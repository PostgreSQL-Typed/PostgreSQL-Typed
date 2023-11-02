import { DateMultiRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

// MultiRange types were introduced in PostgreSQL 14, because we test against older versions, we need to skip coverage for this file
/* c8 ignore start */

export type PgTDateMultiRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "DateMultiRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "DateMultiRange" ? DateMultiRange : string,
	TDriverParameter = DateMultiRange,
	TColumnType extends "PgTDateMultiRange" = "PgTDateMultiRange",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTDateMultiRange<{
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

//#region DateMultiRange
export type PgTDateMultiRangeBuilderInitial<TName extends string> = PgTDateMultiRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTDateMultiRange";
	data: DateMultiRange;
	driverParam: DateMultiRange;
	enumValues: undefined;
}>;

export class PgTDateMultiRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTDateMultiRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTDateMultiRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTDateMultiRange");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateMultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTDateMultiRange<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateMultiRange<T extends ColumnBaseConfig<"custom", "PgTDateMultiRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateMultiRange";

	getSQLType(): string {
		return "datemultirange";
	}

	override mapFromDriverValue(value: DateMultiRange): DateMultiRange {
		return DateMultiRange.from(value);
	}

	override mapToDriverValue(value: DateMultiRange): DateMultiRange {
		const result = DateMultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTDateMultiRangeStringBuilderInitial<TName extends string> = PgTDateMultiRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTDateMultiRangeString";
	data: string;
	driverParam: DateMultiRange;
	enumValues: undefined;
}>;

export class PgTDateMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTDateMultiRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTDateMultiRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTDateMultiRangeString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateMultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTDateMultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateMultiRangeString<T extends ColumnBaseConfig<"string", "PgTDateMultiRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateMultiRangeString";

	getSQLType(): string {
		return "datemultirange";
	}

	override mapFromDriverValue(value: DateMultiRange): string {
		return DateMultiRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): DateMultiRange {
		const result = DateMultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineDateMultiRange<TName extends string>(name: TName, config?: { mode: "string" }): PgTDateMultiRangeStringBuilderInitial<TName>;
export function defineDateMultiRange<TName extends string>(name: TName, config?: { mode: "DateMultiRange" }): PgTDateMultiRangeBuilderInitial<TName>;
export function defineDateMultiRange<TName extends string>(name: TName, config?: { mode: "DateMultiRange" | "string" }) {
	if (config?.mode === "DateMultiRange") return new PgTDateMultiRangeBuilder(name) as PgTDateMultiRangeBuilderInitial<TName>;
	return new PgTDateMultiRangeStringBuilder(name) as PgTDateMultiRangeStringBuilderInitial<TName>;
}
