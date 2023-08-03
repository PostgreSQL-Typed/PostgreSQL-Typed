import { Int4 } from "@postgresql-typed/parsers";
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
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";
import { PgTError } from "../../PgTError.js";

export interface PgTInt4Config<TMode extends "Int4" | "string" | "number" = "Int4" | "string" | "number"> {
	mode?: TMode;
}

export type PgTInt4Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Int4" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int4" ? Int4 : TMode extends "string" ? string : number,
	TDriverParameter = Int4,
> = PgTInt4<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTInt4BuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTInt4Builder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTInt4HKT;
}
export interface PgTInt4HKT extends ColumnHKTBase {
	_type: PgTInt4<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Int4
export type PgTInt4BuilderInitial<TName extends string> = PgTInt4Builder<{
	name: TName;
	data: Int4;
	driverParam: Int4;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4Builder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4Builder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}
}

export class PgTInt4<T extends ColumnBaseConfig> extends PgColumn<PgTInt4HKT, T> {
	static readonly [entityKind]: string = "PgTInt4";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int4.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4 as string
export type PgTInt4StringBuilderInitial<TName extends string> = PgTInt4StringBuilder<{
	name: TName;
	data: string;
	driverParam: Int4;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4StringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4StringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4String<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4String<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}
}

export class PgTInt4String<T extends ColumnBaseConfig> extends PgColumn<PgTInt4HKT, T> {
	static readonly [entityKind]: string = "PgTInt4String";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int4.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4 as number
export type PgTInt4NumberBuilderInitial<TName extends string> = PgTInt4NumberBuilder<{
	name: TName;
	data: number;
	driverParam: Int4;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4NumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4Number<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4Number<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}
}

export class PgTInt4Number<T extends ColumnBaseConfig> extends PgColumn<PgTInt4HKT, T> {
	static readonly [entityKind]: string = "PgTInt4Number";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int4.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt4<TName extends string, TMode extends PgTInt4Config["mode"] & {}>(
	name: TName,
	config?: PgTInt4Config<TMode>
): Equal<TMode, "Int4"> extends true
	? PgTInt4BuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTInt4StringBuilderInitial<TName>
	: PgTInt4NumberBuilderInitial<TName>;
export function defineInt4(name: string, config: PgTInt4Config = {}) {
	if (config.mode === "Int4") return new PgTInt4Builder(name);
	if (config.mode === "string") return new PgTInt4StringBuilder(name);
	return new PgTInt4NumberBuilder(name);
}
