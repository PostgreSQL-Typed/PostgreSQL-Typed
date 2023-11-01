import { Int4MultiRange } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Int4MultiRange
export type PgTInt4MultiRangeBuilderInitial<TName extends string> = PgTInt4MultiRangeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt4MultiRange";
	data: Int4MultiRange;
	driverParam: Int4MultiRange;
	enumValues: undefined;
}>;

export class PgTInt4MultiRangeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt4MultiRange">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt4MultiRange");
	}

	/** @internal */
	build<TTableInt4MultiRange extends string>(table: AnyPgTable<{ name: TTableInt4MultiRange }>): PgTInt4MultiRange<MakeColumnConfig<T, TTableInt4MultiRange>> {
		return new PgTInt4MultiRange<MakeColumnConfig<T, TTableInt4MultiRange>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt4MultiRange<T extends ColumnBaseConfig<"custom", "PgTInt4MultiRange">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt4MultiRange";

	getSQLType(): string {
		return "int4multirange";
	}

	override mapFromDriverValue(value: Int4MultiRange): Int4MultiRange {
		return Int4MultiRange.from(value);
	}

	override mapToDriverValue(value: Int4MultiRange): Int4MultiRange {
		const result = Int4MultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTInt4MultiRangeStringBuilderInitial<TName extends string> = PgTInt4MultiRangeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTInt4MultiRangeString";
	data: string;
	driverParam: Int4MultiRange;
	enumValues: undefined;
}>;

export class PgTInt4MultiRangeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTInt4MultiRangeString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTInt4MultiRangeString");
	}

	/** @internal */
	build<TTableInt4MultiRange extends string>(
		table: AnyPgTable<{ name: TTableInt4MultiRange }>
	): PgTInt4MultiRangeString<MakeColumnConfig<T, TTableInt4MultiRange>> {
		return new PgTInt4MultiRangeString<MakeColumnConfig<T, TTableInt4MultiRange>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt4MultiRangeString<T extends ColumnBaseConfig<"string", "PgTInt4MultiRangeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeString";

	getSQLType(): string {
		return "int4multirange";
	}

	override mapFromDriverValue(value: Int4MultiRange): string {
		return Int4MultiRange.from(value).postgres;
	}

	override mapToDriverValue(value: string): Int4MultiRange {
		const result = Int4MultiRange.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInt4MultiRange<TName extends string>(name: TName, config: { mode: "Int4MultiRange" }): PgTInt4MultiRangeBuilderInitial<TName>;
export function defineInt4MultiRange<TName extends string>(name: TName, config?: { mode: "string" }): PgTInt4MultiRangeStringBuilderInitial<TName>;
export function defineInt4MultiRange<TName extends string>(name: TName, config?: { mode: "Int4MultiRange" | "string" }) {
	if (config?.mode === "Int4MultiRange") return new PgTInt4MultiRangeBuilder(name) as PgTInt4MultiRangeBuilderInitial<TName>;
	return new PgTInt4MultiRangeStringBuilder(name) as PgTInt4MultiRangeStringBuilderInitial<TName>;
}
