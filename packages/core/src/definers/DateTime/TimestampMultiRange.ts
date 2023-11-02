import { TimestampMultiRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

// MultiRange types were introduced in PostgreSQL 14, because we test against older versions, we need to skip coverage for this file
/* c8 ignore start */

export type PgTTimestampMultiRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampMultiRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampMultiRange" ? TimestampMultiRange : string,
	TDriverParameter = TimestampMultiRange,
	TColumnType extends "PgTTimestampMultiRange" = "PgTTimestampMultiRange",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTTimestampMultiRange<{
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

//#region TimestampMultiRange
export type PgTTimestampMultiRangeBuilderInitial<TName extends string> = PgTTimestampMultiRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampMultiRange";
	data: TimestampMultiRange;
	driverParam: TimestampMultiRange;
	enumValues: undefined;
}>;

export class PgTTimestampMultiRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampMultiRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampMultiRange");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampMultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampMultiRange<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampMultiRange<T extends ColumnBaseConfig<"custom", "PgTTimestampMultiRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRange";

	getSQLType(): string {
		return "tsmultirange";
	}

	override mapFromDriverValue(value: TimestampMultiRange): TimestampMultiRange {
		return TimestampMultiRange.from(value);
	}

	override mapToDriverValue(value: TimestampMultiRange): TimestampMultiRange {
		const result = TimestampMultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimestampMultiRangeStringBuilderInitial<TName extends string> = PgTTimestampMultiRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimestampMultiRangeString";
	data: string;
	driverParam: TimestampMultiRange;
	enumValues: undefined;
}>;

export class PgTTimestampMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimestampMultiRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimestampMultiRangeString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampMultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampMultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampMultiRangeString<T extends ColumnBaseConfig<"string", "PgTTimestampMultiRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeString";

	getSQLType(): string {
		return "tsmultirange";
	}

	override mapFromDriverValue(value: TimestampMultiRange): string {
		return TimestampMultiRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): TimestampMultiRange {
		const result = TimestampMultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTimestampMultiRange<TName extends string>(name: TName, config?: { mode: "string" }): PgTTimestampMultiRangeStringBuilderInitial<TName>;
export function defineTimestampMultiRange<TName extends string>(
	name: TName,
	config?: { mode: "TimestampMultiRange" }
): PgTTimestampMultiRangeBuilderInitial<TName>;
export function defineTimestampMultiRange<TName extends string>(name: TName, config?: { mode: "TimestampMultiRange" | "string" }) {
	if (config?.mode === "TimestampMultiRange") return new PgTTimestampMultiRangeBuilder(name) as PgTTimestampMultiRangeBuilderInitial<TName>;
	return new PgTTimestampMultiRangeStringBuilder(name) as PgTTimestampMultiRangeStringBuilderInitial<TName>;
}
