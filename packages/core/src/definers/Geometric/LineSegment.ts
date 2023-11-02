import { LineSegment } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTLineSegmentType<
	TTableName extends string,
	TName extends string,
	TMode extends "LineSegment" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "LineSegment" ? LineSegment : string,
	TDriverParameter = string,
	TColumnType extends "PgTLineSegment" = "PgTLineSegment",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTLineSegment<{
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

//#region LineSegment
export type PgTLineSegmentBuilderInitial<TName extends string> = PgTLineSegmentBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTLineSegment";
	data: LineSegment;
	driverParam: LineSegment;
	enumValues: undefined;
}>;

export class PgTLineSegmentBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTLineSegment">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTLineSegmentBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTLineSegment");
	}

	/** @internal */
	build<TTableLineSegment extends string>(table: AnyPgTable<{ name: TTableLineSegment }>): PgTLineSegment<MakeColumnConfig<T, TTableLineSegment>> {
		return new PgTLineSegment<MakeColumnConfig<T, TTableLineSegment>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTLineSegment<T extends ColumnBaseConfig<"custom", "PgTLineSegment">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTLineSegment";

	getSQLType(): string {
		return "lseg";
	}

	override mapFromDriverValue(value: LineSegment): LineSegment {
		return LineSegment.from(value);
	}

	override mapToDriverValue(value: LineSegment): LineSegment {
		const result = LineSegment.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTLineSegmentStringBuilderInitial<TName extends string> = PgTLineSegmentStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTLineSegmentString";
	data: string;
	driverParam: LineSegment;
	enumValues: undefined;
}>;

export class PgTLineSegmentStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTLineSegmentString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTLineSegmentStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTLineSegmentString");
	}

	/** @internal */
	build<TTableLineSegment extends string>(table: AnyPgTable<{ name: TTableLineSegment }>): PgTLineSegmentString<MakeColumnConfig<T, TTableLineSegment>> {
		return new PgTLineSegmentString<MakeColumnConfig<T, TTableLineSegment>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTLineSegmentString<T extends ColumnBaseConfig<"string", "PgTLineSegmentString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTLineSegmentString";

	getSQLType(): string {
		return "lseg";
	}

	override mapFromDriverValue(value: LineSegment): string {
		return LineSegment.from(value).postgres;
	}

	override mapToDriverValue(value: string): LineSegment {
		const result = LineSegment.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineLineSegment<TName extends string>(name: TName, config?: { mode: "string" }): PgTLineSegmentStringBuilderInitial<TName>;
export function defineLineSegment<TName extends string>(name: TName, config?: { mode: "LineSegment" }): PgTLineSegmentBuilderInitial<TName>;
export function defineLineSegment<TName extends string>(name: TName, config?: { mode: "LineSegment" | "string" }) {
	if (config?.mode === "LineSegment") return new PgTLineSegmentBuilder(name) as PgTLineSegmentBuilderInitial<TName>;
	return new PgTLineSegmentStringBuilder(name) as PgTLineSegmentStringBuilderInitial<TName>;
}
