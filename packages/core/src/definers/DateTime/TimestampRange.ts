import { TimestampRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTTimestampRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampRange" ? TimestampRange : string,
	TDriverParameter = TimestampRange,
	TColumnType extends "PgTTimestampRange" = "PgTTimestampRange",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTTimestampRange<{
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

//#region TimestampRange
export type PgTTimestampRangeBuilderInitial<TName extends string> = PgTTimestampRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampRange";
	data: TimestampRange;
	driverParam: TimestampRange;
	enumValues: undefined;
}>;

export class PgTTimestampRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampRange");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampRange<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampRange<T extends ColumnBaseConfig<"custom", "PgTTimestampRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampRange";

	getSQLType(): string {
		return "tsrange";
	}

	override mapFromDriverValue(value: TimestampRange): TimestampRange {
		return TimestampRange.from(value);
	}

	override mapToDriverValue(value: TimestampRange): TimestampRange {
		const result = TimestampRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimestampRangeStringBuilderInitial<TName extends string> = PgTTimestampRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimestampRangeString";
	data: string;
	driverParam: TimestampRange;
	enumValues: undefined;
}>;

export class PgTTimestampRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimestampRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimestampRangeString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampRangeString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampRangeString<T extends ColumnBaseConfig<"string", "PgTTimestampRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampRangeString";

	getSQLType(): string {
		return "tsrange";
	}

	override mapFromDriverValue(value: TimestampRange): string {
		return TimestampRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): TimestampRange {
		const result = TimestampRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTimestampRange<TName extends string>(name: TName, config?: { mode: "string" }): PgTTimestampRangeStringBuilderInitial<TName>;
export function defineTimestampRange<TName extends string>(name: TName, config?: { mode: "TimestampRange" }): PgTTimestampRangeBuilderInitial<TName>;
export function defineTimestampRange<TName extends string>(name: TName, config?: { mode: "TimestampRange" | "string" }) {
	if (config?.mode === "TimestampRange") return new PgTTimestampRangeBuilder(name) as PgTTimestampRangeBuilderInitial<TName>;
	return new PgTTimestampRangeStringBuilder(name) as PgTTimestampRangeStringBuilderInitial<TName>;
}
