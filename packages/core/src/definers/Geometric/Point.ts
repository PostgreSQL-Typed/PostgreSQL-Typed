import { Point } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Point
export type PgTPointBuilderInitial<TName extends string> = PgTPointBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTPoint";
	data: Point;
	driverParam: Point;
	enumValues: undefined;
}>;

export class PgTPointBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTPoint">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTPointBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTPoint");
	}

	/** @internal */
	build<TTablePoint extends string>(table: AnyPgTable<{ name: TTablePoint }>): PgTPoint<MakeColumnConfig<T, TTablePoint>> {
		return new PgTPoint<MakeColumnConfig<T, TTablePoint>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTPoint<T extends ColumnBaseConfig<"custom", "PgTPoint">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTPoint";

	getSQLType(): string {
		return "point";
	}

	override mapFromDriverValue(value: Point): Point {
		return Point.from(value);
	}

	override mapToDriverValue(value: Point): Point {
		const result = Point.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTPointStringBuilderInitial<TName extends string> = PgTPointStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTPointString";
	data: string;
	driverParam: Point;
	enumValues: undefined;
}>;

export class PgTPointStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTPointString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTPointStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTPointString");
	}

	/** @internal */
	build<TTablePoint extends string>(table: AnyPgTable<{ name: TTablePoint }>): PgTPointString<MakeColumnConfig<T, TTablePoint>> {
		return new PgTPointString<MakeColumnConfig<T, TTablePoint>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTPointString<T extends ColumnBaseConfig<"string", "PgTPointString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTPointString";

	getSQLType(): string {
		return "point";
	}

	override mapFromDriverValue(value: Point): string {
		return Point.from(value).postgres;
	}

	override mapToDriverValue(value: string): Point {
		const result = Point.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function definePoint<TName extends string>(name: TName, config: { mode: "Point" }): PgTPointBuilderInitial<TName>;
export function definePoint<TName extends string>(name: TName, config?: { mode: "string" }): PgTPointStringBuilderInitial<TName>;
export function definePoint<TName extends string>(name: TName, config?: { mode: "Point" | "string" }) {
	if (config?.mode === "Point") return new PgTPointBuilder(name) as PgTPointBuilderInitial<TName>;
	return new PgTPointStringBuilder(name) as PgTPointStringBuilderInitial<TName>;
}
