import { Int8Range } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Int8Range
export type PgTInt8RangeBuilderInitial<TName extends string> = PgTInt8RangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt8Range";
	data: Int8Range;
	driverParam: Int8Range;
	enumValues: undefined;
}>;

export class PgTInt8RangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt8Range">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8RangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt8Range");
	}

	/** @internal */
	build<TTableInt8Range extends string>(table: AnyPgTable<{ name: TTableInt8Range }>): PgTInt8Range<MakeColumnConfig<T, TTableInt8Range>> {
		return new PgTInt8Range<MakeColumnConfig<T, TTableInt8Range>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8Range<T extends ColumnBaseConfig<"custom", "PgTInt8Range">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8Range";

	getSQLType(): string {
		return "int8range";
	}

	override mapFromDriverValue(value: Int8Range): Int8Range {
		return Int8Range.from(value);
	}

	override mapToDriverValue(value: Int8Range): Int8Range {
		const result = Int8Range.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTInt8RangeStringBuilderInitial<TName extends string> = PgTInt8RangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTInt8RangeString";
	data: string;
	driverParam: Int8Range;
	enumValues: undefined;
}>;

export class PgTInt8RangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTInt8RangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8RangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTInt8RangeString");
	}

	/** @internal */
	build<TTableInt8Range extends string>(table: AnyPgTable<{ name: TTableInt8Range }>): PgTInt8RangeString<MakeColumnConfig<T, TTableInt8Range>> {
		return new PgTInt8RangeString<MakeColumnConfig<T, TTableInt8Range>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8RangeString<T extends ColumnBaseConfig<"string", "PgTInt8RangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8RangeString";

	getSQLType(): string {
		return "int8range";
	}

	override mapFromDriverValue(value: Int8Range): string {
		return Int8Range.from(value).postgres;
	}

	override mapToDriverValue(value: string): Int8Range {
		const result = Int8Range.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInt8Range<TName extends string>(name: TName, config: { mode: "Int8Range" }): PgTInt8RangeBuilderInitial<TName>;
export function defineInt8Range<TName extends string>(name: TName, config?: { mode: "string" }): PgTInt8RangeStringBuilderInitial<TName>;
export function defineInt8Range<TName extends string>(name: TName, config?: { mode: "Int8Range" | "string" }) {
	if (config?.mode === "Int8Range") return new PgTInt8RangeBuilder(name) as PgTInt8RangeBuilderInitial<TName>;
	return new PgTInt8RangeStringBuilder(name) as PgTInt8RangeStringBuilderInitial<TName>;
}
