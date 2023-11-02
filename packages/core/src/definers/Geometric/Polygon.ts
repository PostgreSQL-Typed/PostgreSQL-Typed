import { Polygon } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTPolygonType<
	TTableName extends string,
	TName extends string,
	TMode extends "Polygon" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Polygon" ? Polygon : string,
	TDriverParameter = string,
	TColumnType extends "PgTPolygon" = "PgTPolygon",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTPolygon<{
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

//#region Polygon
export type PgTPolygonBuilderInitial<TName extends string> = PgTPolygonBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTPolygon";
	data: Polygon;
	driverParam: Polygon;
	enumValues: undefined;
}>;

export class PgTPolygonBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTPolygon">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTPolygonBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTPolygon");
	}

	/** @internal */
	build<TTablePolygon extends string>(table: AnyPgTable<{ name: TTablePolygon }>): PgTPolygon<MakeColumnConfig<T, TTablePolygon>> {
		return new PgTPolygon<MakeColumnConfig<T, TTablePolygon>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTPolygon<T extends ColumnBaseConfig<"custom", "PgTPolygon">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTPolygon";

	getSQLType(): string {
		return "polygon";
	}

	override mapFromDriverValue(value: Polygon): Polygon {
		return Polygon.from(value);
	}

	override mapToDriverValue(value: Polygon): Polygon {
		const result = Polygon.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTPolygonStringBuilderInitial<TName extends string> = PgTPolygonStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTPolygonString";
	data: string;
	driverParam: Polygon;
	enumValues: undefined;
}>;

export class PgTPolygonStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTPolygonString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTPolygonStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTPolygonString");
	}

	/** @internal */
	build<TTablePolygon extends string>(table: AnyPgTable<{ name: TTablePolygon }>): PgTPolygonString<MakeColumnConfig<T, TTablePolygon>> {
		return new PgTPolygonString<MakeColumnConfig<T, TTablePolygon>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTPolygonString<T extends ColumnBaseConfig<"string", "PgTPolygonString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTPolygonString";

	getSQLType(): string {
		return "polygon";
	}

	override mapFromDriverValue(value: Polygon): string {
		return Polygon.from(value).postgres;
	}

	override mapToDriverValue(value: string): Polygon {
		const result = Polygon.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function definePolygon<TName extends string>(name: TName, config?: { mode: "string" }): PgTPolygonStringBuilderInitial<TName>;
export function definePolygon<TName extends string>(name: TName, config?: { mode: "Polygon" }): PgTPolygonBuilderInitial<TName>;
export function definePolygon<TName extends string>(name: TName, config?: { mode: "Polygon" | "string" }) {
	if (config?.mode === "Polygon") return new PgTPolygonBuilder(name) as PgTPolygonBuilderInitial<TName>;
	return new PgTPolygonStringBuilder(name) as PgTPolygonStringBuilderInitial<TName>;
}
