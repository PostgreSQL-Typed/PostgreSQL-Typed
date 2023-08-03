import { BigNumber, Float8 } from "@postgresql-typed/parsers";
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

export interface PgTFloat8Config<TMode extends "Float8" | "string" | "BigNumber" | "number" = "Float8" | "string" | "BigNumber" | "number"> {
	mode?: TMode;
}

export type PgTFloat8Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Float8" | "string" | "BigNumber" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Float8" ? Float8 : TMode extends "BigNumber" ? BigNumber : TMode extends "number" ? number : string,
	TDriverParameter = Float8,
> = PgTFloat8<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTFloat8BuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTFloat8Builder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTFloat8HKT;
}
export interface PgTFloat8HKT extends ColumnHKTBase {
	_type: PgTFloat8<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Float8
export type PgTFloat8BuilderInitial<TName extends string> = PgTFloat8Builder<{
	name: TName;
	data: Float8;
	driverParam: Float8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8Builder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8Builder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat8<T extends ColumnBaseConfig> extends PgColumn<PgTFloat8HKT, T> {
	static readonly [entityKind]: string = "PgTFloat8";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Float8 as string
export type PgTFloat8StringBuilderInitial<TName extends string> = PgTFloat8StringBuilder<{
	name: TName;
	data: string;
	driverParam: Float8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8StringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8StringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8String<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8String<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat8String<T extends ColumnBaseConfig> extends PgColumn<PgTFloat8HKT, T> {
	static readonly [entityKind]: string = "PgTFloat8String";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Float8 as BigNumber
export type PgTFloat8BigNumberBuilderInitial<TName extends string> = PgTFloat8BigNumberBuilder<{
	name: TName;
	data: BigNumber;
	driverParam: Float8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8BigNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8BigNumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8BigNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8BigNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat8BigNumber<T extends ColumnBaseConfig> extends PgColumn<PgTFloat8HKT, T> {
	static readonly [entityKind]: string = "PgTFloat8BigNumber";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string).toBigNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Float8 as number
export type PgTFloat8NumberBuilderInitial<TName extends string> = PgTFloat8NumberBuilder<{
	name: TName;
	data: number;
	driverParam: Float8;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTFloat8BuilderHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8NumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8Number<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8Number<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTFloat8Number<T extends ColumnBaseConfig> extends PgColumn<PgTFloat8HKT, T> {
	static readonly [entityKind]: string = "PgTFloat8Number";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Float8.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineFloat8<TName extends string, TMode extends PgTFloat8Config["mode"] & {}>(
	name: TName,
	config?: PgTFloat8Config<TMode>
): Equal<TMode, "Float8"> extends true
	? PgTFloat8BuilderInitial<TName>
	: Equal<TMode, "BigNumber"> extends true
	? PgTFloat8BigNumberBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTFloat8StringBuilderInitial<TName>
	: PgTFloat8NumberBuilderInitial<TName>;
export function defineFloat8(name: string, config: PgTFloat8Config = {}) {
	if (config.mode === "Float8") return new PgTFloat8Builder(name);
	if (config.mode === "BigNumber") return new PgTFloat8BigNumberBuilder(name);
	if (config.mode === "string") return new PgTFloat8StringBuilder(name);
	return new PgTFloat8NumberBuilder(name);
}
