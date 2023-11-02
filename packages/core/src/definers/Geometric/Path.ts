import { Path } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTPathType<
	TTableName extends string,
	TName extends string,
	TMode extends "Path" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Path" ? Path : string,
	TDriverParameter = Path,
	TColumnType extends "PgTPath" = "PgTPath",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTPath<{
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

//#region Path
export type PgTPathBuilderInitial<TName extends string> = PgTPathBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTPath";
	data: Path;
	driverParam: Path;
	enumValues: undefined;
}>;

export class PgTPathBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTPath">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTPathBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTPath");
	}

	/** @internal */
	build<TTablePath extends string>(table: AnyPgTable<{ name: TTablePath }>): PgTPath<MakeColumnConfig<T, TTablePath>> {
		return new PgTPath<MakeColumnConfig<T, TTablePath>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTPath<T extends ColumnBaseConfig<"custom", "PgTPath">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTPath";

	getSQLType(): string {
		return "path";
	}

	override mapFromDriverValue(value: Path): Path {
		return Path.from(value);
	}

	override mapToDriverValue(value: Path): Path {
		const result = Path.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTPathStringBuilderInitial<TName extends string> = PgTPathStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTPathString";
	data: string;
	driverParam: Path;
	enumValues: undefined;
}>;

export class PgTPathStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTPathString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTPathStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTPathString");
	}

	/** @internal */
	build<TTablePath extends string>(table: AnyPgTable<{ name: TTablePath }>): PgTPathString<MakeColumnConfig<T, TTablePath>> {
		return new PgTPathString<MakeColumnConfig<T, TTablePath>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTPathString<T extends ColumnBaseConfig<"string", "PgTPathString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTPathString";

	getSQLType(): string {
		return "path";
	}

	override mapFromDriverValue(value: Path): string {
		return Path.from(value).postgres;
	}

	override mapToDriverValue(value: string): Path {
		const result = Path.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function definePath<TName extends string>(name: TName, config?: { mode: "string" }): PgTPathStringBuilderInitial<TName>;
export function definePath<TName extends string>(name: TName, config?: { mode: "Path" }): PgTPathBuilderInitial<TName>;
export function definePath<TName extends string>(name: TName, config?: { mode: "Path" | "string" }) {
	if (config?.mode === "Path") return new PgTPathBuilder(name) as PgTPathBuilderInitial<TName>;
	return new PgTPathStringBuilder(name) as PgTPathStringBuilderInitial<TName>;
}
