import { BitVarying } from "@postgresql-typed/parsers";
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

export interface PgTBitVaryingConfig<TMode extends "BitVarying" | "string" | "number" = "BitVarying" | "string" | "number"> {
	mode?: TMode;
	length?: number;
}
export interface PgTBitVaryingBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTBitVaryingBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTBitVaryingHKT;
}
export interface PgTBitVaryingHKT extends ColumnHKTBase {
	_type: PgTBitVarying<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers BitVarying
export type PgTBitVaryingBuilderInitial<TName extends string> = PgTBitVaryingBuilder<{
	name: TName;
	data: BitVarying<number>;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitVaryingBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBitVaryingBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitVaryingBuilder";

	constructor(name: string, config: PgTBitVaryingConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitVarying<MakeColumnConfig<T, TTableName>> {
		return new PgTBitVarying<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTBitVarying<T extends ColumnBaseConfig> extends PgColumn<PgTBitVaryingHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitVarying";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varbit" : `varbit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return BitVarying.setN(this.config.length).from(value as string);
		return BitVarying.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return BitVarying.setN(this.config.length).from(value as string);
		return BitVarying.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers BitVarying as string
export type PgTBitVaryingStringBuilderInitial<TName extends string> = PgTBitVaryingStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitVaryingStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBitVaryingBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitVaryingStringBuilder";

	constructor(name: string, config: PgTBitVaryingConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitVaryingString<MakeColumnConfig<T, TTableName>> {
		return new PgTBitVaryingString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTBitVaryingString<T extends ColumnBaseConfig> extends PgColumn<PgTBitVaryingHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitVaryingString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varbit" : `varbit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return BitVarying.setN(this.config.length).from(value as string).postgres;
		return BitVarying.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return BitVarying.setN(this.config.length).from(value as string);
		return BitVarying.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers BitVarying as number
export type PgTBitVaryingNumberBuilderInitial<TName extends string> = PgTBitVaryingNumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitVaryingNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBitVaryingBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitVaryingNumberBuilder";

	constructor(name: string, config: PgTBitVaryingConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitVaryingNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTBitVaryingNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTBitVaryingNumber<T extends ColumnBaseConfig> extends PgColumn<PgTBitVaryingHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitVaryingNumber";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varbit" : `varbit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) {
			return BitVarying.setN(this.config.length)
				.from(value as string)
				.toNumber();
		}
		return BitVarying.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return BitVarying.setN(this.config.length).from(value as number);
		return BitVarying.from(value as number);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineBitVarying<TName extends string, TMode extends PgTBitVaryingConfig["mode"] & {}>(
	name: TName,
	config?: PgTBitVaryingConfig<TMode>
): Equal<TMode, "BitVarying"> extends true
	? PgTBitVaryingBuilderInitial<TName>
	: Equal<TMode, "number"> extends true
	? PgTBitVaryingNumberBuilderInitial<TName>
	: PgTBitVaryingStringBuilderInitial<TName>;
export function defineBitVarying(name: string, config: PgTBitVaryingConfig = {}) {
	const { length, mode } = config;
	if (mode === "BitVarying") {
		return new PgTBitVaryingBuilder(name, {
			length,
		});
	}
	if (mode === "number") {
		return new PgTBitVaryingNumberBuilder(name, {
			length,
		});
	}
	return new PgTBitVaryingStringBuilder(name, { length });
}
