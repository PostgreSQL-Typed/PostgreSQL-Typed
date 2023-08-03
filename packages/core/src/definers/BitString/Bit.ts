import { Bit } from "@postgresql-typed/parsers";
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

export interface PgTBitConfig<TMode extends "Bit" | "string" | "number" = "Bit" | "string" | "number"> {
	mode?: TMode;
	length?: number;
}

export type PgTBitType<
	TTableName extends string,
	TName extends string,
	TMode extends "Bit" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Bit" ? Bit<number> : TMode extends "string" ? string : number,
	TDriverParameter = Bit<number>,
> = PgTBit<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTBitBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTBitBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTBitHKT;
}
export interface PgTBitHKT extends ColumnHKTBase {
	_type: PgTBit<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Bit
export type PgTBitBuilderInitial<TName extends string> = PgTBitBuilder<{
	name: TName;
	data: Bit<number>;
	driverParam: Bit<number>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBitBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitBuilder";

	constructor(name: string, config: PgTBitConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBit<MakeColumnConfig<T, TTableName>> {
		return new PgTBit<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTBit<T extends ColumnBaseConfig> extends PgColumn<PgTBitHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBit";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Bit.setN(this.config.length).from(value as string);
		return Bit.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = this.config.length === undefined ? Bit.safeFrom(value as string) : Bit.setN(this.config.length).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Bit as string
export type PgTBitStringBuilderInitial<TName extends string> = PgTBitStringBuilder<{
	name: TName;
	data: string;
	driverParam: Bit<number>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBitBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitStringBuilder";

	constructor(name: string, config: PgTBitConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitString<MakeColumnConfig<T, TTableName>> {
		return new PgTBitString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTBitString<T extends ColumnBaseConfig> extends PgColumn<PgTBitHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Bit.setN(this.config.length).from(value as string).postgres;
		return Bit.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = this.config.length === undefined ? Bit.safeFrom(value as string) : Bit.setN(this.config.length).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Bit as number
export type PgTBitNumberBuilderInitial<TName extends string> = PgTBitNumberBuilder<{
	name: TName;
	data: number;
	driverParam: Bit<number>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBitBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitNumberBuilder";

	constructor(name: string, config: PgTBitConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTBitNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTBitNumber<T extends ColumnBaseConfig> extends PgColumn<PgTBitHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitNumber";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) {
			return Bit.setN(this.config.length)
				.from(value as string)
				.toNumber();
		}
		return Bit.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = this.config.length === undefined ? Bit.safeFrom(value as string) : Bit.setN(this.config.length).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineBit<TName extends string, TMode extends PgTBitConfig["mode"] & {}>(
	name: TName,
	config?: PgTBitConfig<TMode>
): Equal<TMode, "Bit"> extends true
	? PgTBitBuilderInitial<TName>
	: Equal<TMode, "number"> extends true
	? PgTBitNumberBuilderInitial<TName>
	: PgTBitStringBuilderInitial<TName>;
export function defineBit(name: string, config: PgTBitConfig = {}) {
	const { length, mode } = config;
	if (mode === "Bit") {
		return new PgTBitBuilder(name, {
			length,
		});
	}
	if (mode === "number") {
		return new PgTBitNumberBuilder(name, {
			length,
		});
	}
	return new PgTBitStringBuilder(name, { length });
}
