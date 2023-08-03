import { BigNumber, Float4 } from "@postgresql-typed/parsers";
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

export interface PgTFloat4Config<TMode extends "Float4" | "string" | "BigNumber" | "number" = "Float4" | "string" | "BigNumber" | "number"> {
	mode?: TMode;
}

export type PgTFloat4Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Float4" | "string" | "BigNumber" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Float4" ? Float4 : TMode extends "BigNumber" ? BigNumber : TMode extends "number" ? number : string,
	TDriverParameter = Float4,
> = PgTFloat4<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTFloat4BuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTFloat4Builder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTFloat4HKT;
}
export interface PgTFloat4HKT extends ColumnHKTBase {
	_type: PgTFloat4<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Float4
export type PgTFloat4BuilderInitial<TName extends string> = PgTFloat4Builder<{
	name: TName;
	data: Float4;
	driverParam: Float4;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4Builder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat4BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4Builder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat4<T extends ColumnBaseConfig> extends PgColumn<PgTFloat4HKT, T> {
	static readonly [entityKind]: string = "PgTFloat4";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float4.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Float4 as string
export type PgTFloat4StringBuilderInitial<TName extends string> = PgTFloat4StringBuilder<{
	name: TName;
	data: string;
	driverParam: Float4;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4StringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat4BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4StringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4String<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4String<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat4String<T extends ColumnBaseConfig> extends PgColumn<PgTFloat4HKT, T> {
	static readonly [entityKind]: string = "PgTFloat4String";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float4.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Float4 as BigNumber
export type PgTFloat4BigNumberBuilderInitial<TName extends string> = PgTFloat4BigNumberBuilder<{
	name: TName;
	data: BigNumber;
	driverParam: Float4;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4BigNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat4BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4BigNumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4BigNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4BigNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat4BigNumber<T extends ColumnBaseConfig> extends PgColumn<PgTFloat4HKT, T> {
	static readonly [entityKind]: string = "PgTFloat4BigNumber";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string).toBigNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float4.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Float4 as number
export type PgTFloat4NumberBuilderInitial<TName extends string> = PgTFloat4NumberBuilder<{
	name: TName;
	data: number;
	driverParam: Float4;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat4BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4NumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4Number<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4Number<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat4Number<T extends ColumnBaseConfig> extends PgColumn<PgTFloat4HKT, T> {
	static readonly [entityKind]: string = "PgTFloat4Number";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float4.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineFloat4<TName extends string, TMode extends PgTFloat4Config["mode"] & {}>(
	name: TName,
	config?: PgTFloat4Config<TMode>
): Equal<TMode, "Float4"> extends true
	? PgTFloat4BuilderInitial<TName>
	: Equal<TMode, "BigNumber"> extends true
	? PgTFloat4BigNumberBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTFloat4StringBuilderInitial<TName>
	: PgTFloat4NumberBuilderInitial<TName>;
export function defineFloat4(name: string, config: PgTFloat4Config = {}) {
	if (config.mode === "Float4") return new PgTFloat4Builder(name);
	if (config.mode === "BigNumber") return new PgTFloat4BigNumberBuilder(name);
	if (config.mode === "string") return new PgTFloat4StringBuilder(name);
	return new PgTFloat4NumberBuilder(name);
}
