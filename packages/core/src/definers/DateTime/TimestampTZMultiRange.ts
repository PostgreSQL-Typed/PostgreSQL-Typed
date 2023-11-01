/* eslint-disable unicorn/filename-case */
import { TimestampTZMultiRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region TimestampTZMultiRange
export type PgTTimestampTZMultiRangeBuilderInitial<TName extends string> = PgTTimestampTZMultiRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampTZMultiRange";
	data: TimestampTZMultiRange;
	driverParam: TimestampTZMultiRange;
	enumValues: undefined;
}>;

export class PgTTimestampTZMultiRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampTZMultiRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampTZMultiRange");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZMultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZMultiRange<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZMultiRange<T extends ColumnBaseConfig<"custom", "PgTTimestampTZMultiRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRange";

	getSQLType(): string {
		return "tstzmultirange";
	}

	override mapFromDriverValue(value: TimestampTZMultiRange): TimestampTZMultiRange {
		return TimestampTZMultiRange.from(value);
	}

	override mapToDriverValue(value: TimestampTZMultiRange): TimestampTZMultiRange {
		const result = TimestampTZMultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimestampTZMultiRangeStringBuilderInitial<TName extends string> = PgTTimestampTZMultiRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimestampTZMultiRangeString";
	data: string;
	driverParam: TimestampTZMultiRange;
	enumValues: undefined;
}>;

export class PgTTimestampTZMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimestampTZMultiRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimestampTZMultiRangeString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZMultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZMultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZMultiRangeString<T extends ColumnBaseConfig<"string", "PgTTimestampTZMultiRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeString";

	getSQLType(): string {
		return "tstzmultirange";
	}

	override mapFromDriverValue(value: TimestampTZMultiRange): string {
		return TimestampTZMultiRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): TimestampTZMultiRange {
		const result = TimestampTZMultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTimestampTZMultiRange<TName extends string>(
	name: TName,
	config: { mode: "TimestampTZMultiRange" }
): PgTTimestampTZMultiRangeBuilderInitial<TName>;
export function defineTimestampTZMultiRange<TName extends string>(
	name: TName,
	config?: { mode: "string" }
): PgTTimestampTZMultiRangeStringBuilderInitial<TName>;
export function defineTimestampTZMultiRange<TName extends string>(name: TName, config?: { mode: "TimestampTZMultiRange" | "string" }) {
	if (config?.mode === "TimestampTZMultiRange") return new PgTTimestampTZMultiRangeBuilder(name) as PgTTimestampTZMultiRangeBuilderInitial<TName>;
	return new PgTTimestampTZMultiRangeStringBuilder(name) as PgTTimestampTZMultiRangeStringBuilderInitial<TName>;
}
