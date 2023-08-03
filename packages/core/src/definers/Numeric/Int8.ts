import { Int8 } from "@postgresql-typed/parsers";
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

export interface PgTInt8Config<TMode extends "Int8" | "string" | "BigInt" | "number" = "Int8" | "string" | "BigInt" | "number"> {
	mode?: TMode;
}

export type PgTInt8Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Int8" | "string" | "BigInt" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int8" ? Int8 : TMode extends "string" ? string : TMode extends "BigInt" ? bigint : number,
	TDriverParameter = Int8,
> = PgTInt8<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTInt8BuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTInt8Builder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTInt8HKT;
}
export interface PgTInt8HKT extends ColumnHKTBase {
	_type: PgTInt8<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Int8
export type PgTInt8BuilderInitial<TName extends string> = PgTInt8Builder<{
	name: TName;
	data: Int8;
	driverParam: Int8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8Builder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8Builder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTInt8<T extends ColumnBaseConfig> extends PgColumn<PgTInt8HKT, T> {
	static readonly [entityKind]: string = "PgTInt8";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8 as string
export type PgTInt8StringBuilderInitial<TName extends string> = PgTInt8StringBuilder<{
	name: TName;
	data: string;
	driverParam: Int8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8StringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8StringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8String<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8String<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTInt8String<T extends ColumnBaseConfig> extends PgColumn<PgTInt8HKT, T> {
	static readonly [entityKind]: string = "PgTInt8String";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8 as BigInt
export type PgTInt8BigIntBuilderInitial<TName extends string> = PgTInt8BigIntBuilder<{
	name: TName;
	data: bigint;
	driverParam: Int8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8BigIntBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8BigIntBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8BigInt<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8BigInt<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTInt8BigInt<T extends ColumnBaseConfig> extends PgColumn<PgTInt8HKT, T> {
	static readonly [entityKind]: string = "PgTInt8BigInt";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string).toBigint();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8 as number
export type PgTInt8NumberBuilderInitial<TName extends string> = PgTInt8NumberBuilder<{
	name: TName;
	data: number;
	driverParam: Int8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8NumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8Number<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8Number<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTInt8Number<T extends ColumnBaseConfig> extends PgColumn<PgTInt8HKT, T> {
	static readonly [entityKind]: string = "PgTInt8Number";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt8<TName extends string, TMode extends PgTInt8Config["mode"] & {}>(
	name: TName,
	config?: PgTInt8Config<TMode>
): Equal<TMode, "Int8"> extends true
	? PgTInt8BuilderInitial<TName>
	: Equal<TMode, "BigInt"> extends true
	? PgTInt8BigIntBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTInt8StringBuilderInitial<TName>
	: PgTInt8NumberBuilderInitial<TName>;
export function defineInt8(name: string, config: PgTInt8Config = {}) {
	if (config.mode === "Int8") return new PgTInt8Builder(name);
	if (config.mode === "BigInt") return new PgTInt8BigIntBuilder(name);
	if (config.mode === "string") return new PgTInt8StringBuilder(name);
	return new PgTInt8NumberBuilder(name);
}
