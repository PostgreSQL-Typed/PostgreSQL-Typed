import { CharacterVarying } from "@postgresql-typed/parsers";
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

export interface PgTCharacterVaryingConfig<TMode extends "CharacterVarying" | "string" = "CharacterVarying" | "string"> {
	mode?: TMode;
	length?: number;
}

export type PgTCharacterVaryingType<
	TTableName extends string,
	TName extends string,
	TMode extends "CharacterVarying" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "CharacterVarying" ? CharacterVarying<number> : string,
	TDriverParameter = CharacterVarying<number>
> = PgTCharacterVarying<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTCharacterVaryingBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTCharacterVaryingBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTCharacterVaryingHKT;
}
export interface PgTCharacterVaryingHKT extends ColumnHKTBase {
	_type: PgTCharacterVarying<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers CharacterVarying
export type PgTCharacterVaryingBuilderInitial<TName extends string> = PgTCharacterVaryingBuilder<{
	name: TName;
	data: CharacterVarying<number>;
	driverParam: CharacterVarying<number>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterVaryingBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTCharacterVaryingBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTCharacterVaryingBuilder";

	constructor(name: string, config: PgTCharacterVaryingConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterVarying<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterVarying<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTCharacterVarying<T extends ColumnBaseConfig> extends PgColumn<PgTCharacterVaryingHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTCharacterVarying";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varchar" : `varchar(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return CharacterVarying.setN(this.config.length).from(value as string);
		return CharacterVarying.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result =
			this.config.length === undefined ? CharacterVarying.safeFrom(value as string) : CharacterVarying.setN(this.config.length).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers CharacterVarying as string
export type PgTCharacterVaryingStringBuilderInitial<TName extends string> = PgTCharacterVaryingStringBuilder<{
	name: TName;
	data: string;
	driverParam: CharacterVarying<number>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterVaryingStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<
	PgTCharacterVaryingBuilderHKT,
	T,
	{ length?: number }
> {
	static readonly [entityKind]: string = "PgTCharacterVaryingStringBuilder";

	constructor(name: string, config: PgTCharacterVaryingConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterVaryingString<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterVaryingString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTCharacterVaryingString<T extends ColumnBaseConfig> extends PgColumn<PgTCharacterVaryingHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTCharacterVaryingString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varchar" : `varchar(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return CharacterVarying.setN(this.config.length).from(value as string).postgres;
		return CharacterVarying.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result =
			this.config.length === undefined ? CharacterVarying.safeFrom(value as string) : CharacterVarying.setN(this.config.length).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineCharacterVarying<TName extends string, TMode extends PgTCharacterVaryingConfig["mode"] & {}>(
	name: TName,
	config?: PgTCharacterVaryingConfig<TMode>
): Equal<TMode, "CharacterVarying"> extends true ? PgTCharacterVaryingBuilderInitial<TName> : PgTCharacterVaryingStringBuilderInitial<TName>;
export function defineCharacterVarying(name: string, config: PgTCharacterVaryingConfig = {}) {
	const { length, mode } = config;
	if (mode === "CharacterVarying") {
		return new PgTCharacterVaryingBuilder(name, {
			length,
		});
	}
	return new PgTCharacterVaryingStringBuilder(name, { length });
}
