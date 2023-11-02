/* eslint-disable unicorn/filename-case */
import { TimestampTZRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTTimestampTZRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampTZRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampTZRange" ? TimestampTZRange : string,
	TDriverParameter = TimestampTZRange,
	TColumnType extends "PgTTimestampTZRange" = "PgTTimestampTZRange",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTTimestampTZRange<{
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

//#region TimestampTZRange
export type PgTTimestampTZRangeBuilderInitial<TName extends string> = PgTTimestampTZRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampTZRange";
	data: TimestampTZRange;
	driverParam: TimestampTZRange;
	enumValues: undefined;
}>;

export class PgTTimestampTZRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampTZRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampTZRange");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZRange<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZRange<T extends ColumnBaseConfig<"custom", "PgTTimestampTZRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZRange";

	getSQLType(): string {
		return "tstzrange";
	}

	override mapFromDriverValue(value: TimestampTZRange): TimestampTZRange {
		return TimestampTZRange.from(value);
	}

	override mapToDriverValue(value: TimestampTZRange): TimestampTZRange {
		const result = TimestampTZRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimestampTZRangeStringBuilderInitial<TName extends string> = PgTTimestampTZRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimestampTZRangeString";
	data: string;
	driverParam: TimestampTZRange;
	enumValues: undefined;
}>;

export class PgTTimestampTZRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimestampTZRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimestampTZRangeString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZRangeString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZRangeString<T extends ColumnBaseConfig<"string", "PgTTimestampTZRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeString";

	getSQLType(): string {
		return "tstzrange";
	}

	override mapFromDriverValue(value: TimestampTZRange): string {
		return TimestampTZRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): TimestampTZRange {
		const result = TimestampTZRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTimestampTZRange<TName extends string>(name: TName, config?: { mode: "string" }): PgTTimestampTZRangeStringBuilderInitial<TName>;
export function defineTimestampTZRange<TName extends string>(name: TName, config?: { mode: "TimestampTZRange" }): PgTTimestampTZRangeBuilderInitial<TName>;
export function defineTimestampTZRange<TName extends string>(name: TName, config?: { mode: "TimestampTZRange" | "string" }) {
	if (config?.mode === "TimestampTZRange") return new PgTTimestampTZRangeBuilder(name) as PgTTimestampTZRangeBuilderInitial<TName>;
	return new PgTTimestampTZRangeStringBuilder(name) as PgTTimestampTZRangeStringBuilderInitial<TName>;
}
