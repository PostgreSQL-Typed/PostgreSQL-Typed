import { Circle } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTCircleType<
	TTableName extends string,
	TName extends string,
	TMode extends "Circle" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Circle" ? Circle : TMode extends "string" ? string : number,
	TDriverParameter = Circle,
	TColumnType extends "PgTCircle" = "PgTCircle",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTCircle<{
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

//#region Circle
export type PgTCircleBuilderInitial<TName extends string> = PgTCircleBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTCircle";
	data: Circle;
	driverParam: Circle;
	enumValues: undefined;
}>;

export class PgTCircleBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTCircle">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTCircleBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTCircle");
	}

	/** @internal */
	build<TTableCircle extends string>(table: AnyPgTable<{ name: TTableCircle }>): PgTCircle<MakeColumnConfig<T, TTableCircle>> {
		return new PgTCircle<MakeColumnConfig<T, TTableCircle>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTCircle<T extends ColumnBaseConfig<"custom", "PgTCircle">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTCircle";

	getSQLType(): string {
		return "circle";
	}

	override mapFromDriverValue(value: Circle): Circle {
		return Circle.from(value);
	}

	override mapToDriverValue(value: Circle): Circle {
		const result = Circle.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTCircleStringBuilderInitial<TName extends string> = PgTCircleStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTCircleString";
	data: string;
	driverParam: Circle;
	enumValues: undefined;
}>;

export class PgTCircleStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTCircleString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTCircleStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTCircleString");
	}

	/** @internal */
	build<TTableCircle extends string>(table: AnyPgTable<{ name: TTableCircle }>): PgTCircleString<MakeColumnConfig<T, TTableCircle>> {
		return new PgTCircleString<MakeColumnConfig<T, TTableCircle>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTCircleString<T extends ColumnBaseConfig<"string", "PgTCircleString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTCircleString";

	getSQLType(): string {
		return "circle";
	}

	override mapFromDriverValue(value: Circle): string {
		return Circle.from(value).postgres;
	}

	override mapToDriverValue(value: string): Circle {
		const result = Circle.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineCircle<TName extends string>(name: TName, config?: { mode: "string" }): PgTCircleStringBuilderInitial<TName>;
export function defineCircle<TName extends string>(name: TName, config?: { mode: "Circle" }): PgTCircleBuilderInitial<TName>;
export function defineCircle<TName extends string>(name: TName, config?: { mode: "Circle" | "string" }) {
	if (config?.mode === "Circle") return new PgTCircleBuilder(name) as PgTCircleBuilderInitial<TName>;
	return new PgTCircleStringBuilder(name) as PgTCircleStringBuilderInitial<TName>;
}
