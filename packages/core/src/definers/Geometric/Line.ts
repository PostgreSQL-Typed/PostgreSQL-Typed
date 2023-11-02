import { Line } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTLineType<
	TTableName extends string,
	TName extends string,
	TMode extends "Line" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Line" ? Line : string,
	TDriverParameter = Line,
	TColumnType extends "PgTLine" = "PgTLine",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTLine<{
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

//#region Line
export type PgTLineBuilderInitial<TName extends string> = PgTLineBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTLine";
	data: Line;
	driverParam: Line;
	enumValues: undefined;
}>;

export class PgTLineBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTLine">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTLineBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTLine");
	}

	/** @internal */
	build<TTableLine extends string>(table: AnyPgTable<{ name: TTableLine }>): PgTLine<MakeColumnConfig<T, TTableLine>> {
		return new PgTLine<MakeColumnConfig<T, TTableLine>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTLine<T extends ColumnBaseConfig<"custom", "PgTLine">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTLine";

	getSQLType(): string {
		return "line";
	}

	override mapFromDriverValue(value: Line): Line {
		return Line.from(value);
	}

	override mapToDriverValue(value: Line): Line {
		const result = Line.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTLineStringBuilderInitial<TName extends string> = PgTLineStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTLineString";
	data: string;
	driverParam: Line;
	enumValues: undefined;
}>;

export class PgTLineStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTLineString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTLineStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTLineString");
	}

	/** @internal */
	build<TTableLine extends string>(table: AnyPgTable<{ name: TTableLine }>): PgTLineString<MakeColumnConfig<T, TTableLine>> {
		return new PgTLineString<MakeColumnConfig<T, TTableLine>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTLineString<T extends ColumnBaseConfig<"string", "PgTLineString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTLineString";

	getSQLType(): string {
		return "line";
	}

	override mapFromDriverValue(value: Line): string {
		return Line.from(value).postgres;
	}

	override mapToDriverValue(value: string): Line {
		const result = Line.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineLine<TName extends string>(name: TName, config?: { mode: "string" }): PgTLineStringBuilderInitial<TName>;
export function defineLine<TName extends string>(name: TName, config?: { mode: "Line" }): PgTLineBuilderInitial<TName>;
export function defineLine<TName extends string>(name: TName, config?: { mode: "Line" | "string" }) {
	if (config?.mode === "Line") return new PgTLineBuilder(name) as PgTLineBuilderInitial<TName>;
	return new PgTLineStringBuilder(name) as PgTLineStringBuilderInitial<TName>;
}
