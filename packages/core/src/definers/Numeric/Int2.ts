import { Int2 } from "@postgresql-typed/parsers";
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

export interface PgTInt2Config<TMode extends "Int2" | "string" | "number" = "Int2" | "string" | "number"> {
	mode?: TMode;
}

export type PgTInt2Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Int2" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int2" ? Int2 : TMode extends "string" ? string : number,
	TDriverParameter = Int2
> = PgTInt2<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTInt2BuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTInt2Builder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTInt2HKT;
}
export interface PgTInt2HKT extends ColumnHKTBase {
	_type: PgTInt2<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Int2
export type PgTInt2BuilderInitial<TName extends string> = PgTInt2Builder<{
	name: TName;
	data: Int2;
	driverParam: Int2;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt2Builder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt2BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt2Builder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt2<MakeColumnConfig<T, TTableName>> {
		return new PgTInt2<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTInt2<T extends ColumnBaseConfig> extends PgColumn<PgTInt2HKT, T> {
	static readonly [entityKind]: string = "PgTInt2";

	getSQLType(): string {
		return "int2";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int2.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int2.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int2 as string
export type PgTInt2StringBuilderInitial<TName extends string> = PgTInt2StringBuilder<{
	name: TName;
	data: string;
	driverParam: Int2;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt2StringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt2BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt2StringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt2String<MakeColumnConfig<T, TTableName>> {
		return new PgTInt2String<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTInt2String<T extends ColumnBaseConfig> extends PgColumn<PgTInt2HKT, T> {
	static readonly [entityKind]: string = "PgTInt2String";

	getSQLType(): string {
		return "int2";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int2.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int2.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int2 as number
export type PgTInt2NumberBuilderInitial<TName extends string> = PgTInt2NumberBuilder<{
	name: TName;
	data: number;
	driverParam: Int2;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt2NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt2BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt2NumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt2Number<MakeColumnConfig<T, TTableName>> {
		return new PgTInt2Number<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTInt2Number<T extends ColumnBaseConfig> extends PgColumn<PgTInt2HKT, T> {
	static readonly [entityKind]: string = "PgTInt2Number";

	getSQLType(): string {
		return "int2";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int2.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int2.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt2<TName extends string, TMode extends PgTInt2Config["mode"] & {}>(
	name: TName,
	config?: PgTInt2Config<TMode>
): Equal<TMode, "Int2"> extends true
	? PgTInt2BuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTInt2StringBuilderInitial<TName>
	: PgTInt2NumberBuilderInitial<TName>;
export function defineInt2(name: string, config: PgTInt2Config = {}) {
	if (config.mode === "Int2") return new PgTInt2Builder(name);
	if (config.mode === "string") return new PgTInt2StringBuilder(name);
	return new PgTInt2NumberBuilder(name);
}
