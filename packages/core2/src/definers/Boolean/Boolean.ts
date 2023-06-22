import { Boolean } from "@postgresql-typed/parsers";
import {
	type Assume,
	type ColumnBaseConfig,
	type ColumnBuilderBaseConfig,
	type ColumnBuilderHKTBase,
	type ColumnHKTBase,
	entityKind,
	type Equal,
	type MakeColumnConfig,
} from "drizzle-orm";
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

export interface PgTBooleanConfig<TMode extends "Boolean" | "string" | "boolean" | "number" = "Boolean" | "string" | "boolean" | "number"> {
	mode?: TMode;
}
export interface PgTBooleanBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTBooleanBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTBooleanHKT;
}
export interface PgTBooleanHKT extends ColumnHKTBase {
	_type: PgTBoolean<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Boolean
export type PgTBooleanBuilderInitial<TName extends string> = PgTBooleanBuilder<{
	name: TName;
	// eslint-disable-next-line @typescript-eslint/ban-types
	data: Boolean;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBooleanBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBooleanBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTBooleanBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBoolean<MakeColumnConfig<T, TTableName>> {
		return new PgTBoolean<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBoolean<T extends ColumnBaseConfig> extends PgColumn<PgTBooleanHKT, T> {
	static readonly [entityKind]: string = "PgTBoolean";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Boolean.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Boolean.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Boolean as string
export type PgTBooleanStringBuilderInitial<TName extends string> = PgTBooleanStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBooleanStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBooleanBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTBooleanStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBooleanString<MakeColumnConfig<T, TTableName>> {
		return new PgTBooleanString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBooleanString<T extends ColumnBaseConfig> extends PgColumn<PgTBooleanHKT, T> {
	static readonly [entityKind]: string = "PgTBooleanString";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Boolean.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Boolean.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Boolean as boolean
export type PgTJSBooleanBuilderInitial<TName extends string> = PgTJSBooleanBuilder<{
	name: TName;
	data: boolean;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTJSBooleanBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBooleanBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTJSBooleanBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTJSBoolean<MakeColumnConfig<T, TTableName>> {
		return new PgTJSBoolean<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTJSBoolean<T extends ColumnBaseConfig> extends PgColumn<PgTBooleanHKT, T> {
	static readonly [entityKind]: string = "PgTJSBoolean";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Boolean.from(value as string).toBoolean();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Boolean.from(value as boolean).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Boolean as number
export type PgTBooleanNumberBuilderInitial<TName extends string> = PgTBooleanNumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBooleanNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBooleanBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTBooleanNumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBooleanNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTBooleanNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBooleanNumber<T extends ColumnBaseConfig> extends PgColumn<PgTBooleanHKT, T> {
	static readonly [entityKind]: string = "PgTBooleanNumber";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Boolean.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Boolean.from(value as number).postgres;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineBoolean<TName extends string, TMode extends PgTBooleanConfig["mode"] & {}>(
	name: TName,
	config?: PgTBooleanConfig<TMode>
): Equal<TMode, "Boolean"> extends true
	? PgTBooleanBuilderInitial<TName>
	: Equal<TMode, "number"> extends true
	? PgTBooleanNumberBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTBooleanStringBuilderInitial<TName>
	: PgTJSBooleanBuilderInitial<TName>;
export function defineBoolean(name: string, config: PgTBooleanConfig = {}) {
	if (config.mode === "Boolean") return new PgTBooleanBuilder(name);
	if (config.mode === "number") return new PgTBooleanNumberBuilder(name);
	if (config.mode === "string") return new PgTBooleanStringBuilder(name);
	return new PgTJSBooleanBuilder(name);
}
