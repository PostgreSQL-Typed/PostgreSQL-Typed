import { DateRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTDateRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "DateRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "DateRange" ? DateRange : string,
	TDriverParameter = DateRange,
	TColumnType extends "PgTDateRange" = "PgTDateRange",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTDateRange<{
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

//#region DateRange
export type PgTDateRangeBuilderInitial<TName extends string> = PgTDateRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTDateRange";
	data: DateRange;
	driverParam: DateRange;
	enumValues: undefined;
}>;

export class PgTDateRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTDateRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTDateRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTDateRange");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateRange<MakeColumnConfig<T, TTableName>> {
		return new PgTDateRange<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateRange<T extends ColumnBaseConfig<"custom", "PgTDateRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateRange";

	getSQLType(): string {
		return "daterange";
	}

	override mapFromDriverValue(value: DateRange): DateRange {
		return DateRange.from(value);
	}

	override mapToDriverValue(value: DateRange): DateRange {
		const result = DateRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTDateRangeStringBuilderInitial<TName extends string> = PgTDateRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTDateRangeString";
	data: string;
	driverParam: DateRange;
	enumValues: undefined;
}>;

export class PgTDateRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTDateRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTDateRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTDateRangeString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTDateRangeString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateRangeString<T extends ColumnBaseConfig<"string", "PgTDateRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateRangeString";

	getSQLType(): string {
		return "daterange";
	}

	override mapFromDriverValue(value: DateRange): string {
		return DateRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): DateRange {
		const result = DateRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineDateRange<TName extends string>(name: TName, config?: { mode: "string" }): PgTDateRangeStringBuilderInitial<TName>;
export function defineDateRange<TName extends string>(name: TName, config?: { mode: "DateRange" }): PgTDateRangeBuilderInitial<TName>;
export function defineDateRange<TName extends string>(name: TName, config?: { mode: "DateRange" | "string" }) {
	if (config?.mode === "DateRange") return new PgTDateRangeBuilder(name) as PgTDateRangeBuilderInitial<TName>;
	return new PgTDateRangeStringBuilder(name) as PgTDateRangeStringBuilderInitial<TName>;
}
