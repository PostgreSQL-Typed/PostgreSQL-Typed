import { Int4Range } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTInt4RangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "Int4Range" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int4Range" ? Int4Range : string,
	TDriverParameter = string,
	TColumnType extends "PgTInt4Range" = "PgTInt4Range",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTInt4Range<{
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

//#region Int4Range
export type PgTInt4RangeBuilderInitial<TName extends string> = PgTInt4RangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt4Range";
	data: Int4Range;
	driverParam: Int4Range;
	enumValues: undefined;
}>;

export class PgTInt4RangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt4Range">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4RangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt4Range");
	}

	/** @internal */
	build<TTableInt4Range extends string>(table: AnyPgTable<{ name: TTableInt4Range }>): PgTInt4Range<MakeColumnConfig<T, TTableInt4Range>> {
		return new PgTInt4Range<MakeColumnConfig<T, TTableInt4Range>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt4Range<T extends ColumnBaseConfig<"custom", "PgTInt4Range">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt4Range";

	getSQLType(): string {
		return "int4range";
	}

	override mapFromDriverValue(value: Int4Range): Int4Range {
		return Int4Range.from(value);
	}

	override mapToDriverValue(value: Int4Range): Int4Range {
		const result = Int4Range.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTInt4RangeStringBuilderInitial<TName extends string> = PgTInt4RangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTInt4RangeString";
	data: string;
	driverParam: Int4Range;
	enumValues: undefined;
}>;

export class PgTInt4RangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTInt4RangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4RangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTInt4RangeString");
	}

	/** @internal */
	build<TTableInt4Range extends string>(table: AnyPgTable<{ name: TTableInt4Range }>): PgTInt4RangeString<MakeColumnConfig<T, TTableInt4Range>> {
		return new PgTInt4RangeString<MakeColumnConfig<T, TTableInt4Range>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt4RangeString<T extends ColumnBaseConfig<"string", "PgTInt4RangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt4RangeString";

	getSQLType(): string {
		return "int4range";
	}

	override mapFromDriverValue(value: Int4Range): string {
		return Int4Range.from(value).postgres;
	}

	override mapToDriverValue(value: string): Int4Range {
		const result = Int4Range.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInt4Range<TName extends string>(name: TName, config?: { mode: "string" }): PgTInt4RangeStringBuilderInitial<TName>;
export function defineInt4Range<TName extends string>(name: TName, config?: { mode: "Int4Range" }): PgTInt4RangeBuilderInitial<TName>;
export function defineInt4Range<TName extends string>(name: TName, config?: { mode: "Int4Range" | "string" }) {
	if (config?.mode === "Int4Range") return new PgTInt4RangeBuilder(name) as PgTInt4RangeBuilderInitial<TName>;
	return new PgTInt4RangeStringBuilder(name) as PgTInt4RangeStringBuilderInitial<TName>;
}
