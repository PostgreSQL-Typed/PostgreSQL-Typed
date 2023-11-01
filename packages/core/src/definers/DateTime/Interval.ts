import { Interval } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Interval
export type PgTIntervalBuilderInitial<TName extends string> = PgTIntervalBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInterval";
	data: Interval;
	driverParam: Interval;
	enumValues: undefined;
}>;

export class PgTIntervalBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTInterval">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTIntervalBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInterval");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInterval<MakeColumnConfig<T, TTableName>> {
		return new PgTInterval<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInterval<T extends ColumnBaseConfig<"custom", "PgTInterval">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInterval";

	getSQLType(): string {
		return "interval";
	}

	override mapFromDriverValue(value: Interval): Interval {
		return Interval.from(value);
	}

	override mapToDriverValue(value: Interval): Interval {
		const result = Interval.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTIntervalStringBuilderInitial<TName extends string> = PgTIntervalStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTIntervalString";
	data: string;
	driverParam: Interval;
	enumValues: undefined;
}>;

export class PgTIntervalStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTIntervalString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTIntervalStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTIntervalString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTIntervalString<MakeColumnConfig<T, TTableName>> {
		return new PgTIntervalString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTIntervalString<T extends ColumnBaseConfig<"string", "PgTIntervalString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTIntervalString";

	getSQLType(): string {
		return "interval";
	}

	override mapFromDriverValue(value: Interval): string {
		return Interval.from(value).postgres;
	}

	override mapToDriverValue(value: string): Interval {
		const result = Interval.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInterval<TName extends string>(name: TName, config: { mode: "Interval" }): PgTIntervalBuilderInitial<TName>;
export function defineInterval<TName extends string>(name: TName, config?: { mode: "string" }): PgTIntervalStringBuilderInitial<TName>;
export function defineInterval<TName extends string>(name: TName, config?: { mode: "Interval" | "string" }) {
	if (config?.mode === "Interval") return new PgTIntervalBuilder(name) as PgTIntervalBuilderInitial<TName>;
	return new PgTIntervalStringBuilder(name) as PgTIntervalStringBuilderInitial<TName>;
}
