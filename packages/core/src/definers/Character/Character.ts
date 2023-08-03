import { Character } from "@postgresql-typed/parsers";
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

export interface PgTCharacterConfig<TMode extends "Character" | "string" = "Character" | "string"> {
	mode?: TMode;
	length?: number;
}

export type PgTCharacterType<
	TTableName extends string,
	TName extends string,
	TMode extends "Character" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Character" ? Character<number> : string,
	TDriverParameter = Character<number>,
> = PgTCharacter<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTCharacterBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTCharacterBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTCharacterHKT;
}
export interface PgTCharacterHKT extends ColumnHKTBase {
	_type: PgTCharacter<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Character
export type PgTCharacterBuilderInitial<TName extends string> = PgTCharacterBuilder<{
	name: TName;
	data: Character<number>;
	driverParam: Character<number>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTCharacterBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTCharacterBuilder";

	constructor(name: string, config: PgTCharacterConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacter<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacter<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTCharacter<T extends ColumnBaseConfig> extends PgColumn<PgTCharacterHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTCharacter";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "char" : `char(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Character.setN(this.config.length).from(value as string);
		return Character.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = this.config.length === undefined ? Character.safeFrom(value as string) : Character.setN(this.config.length).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Character as string
export type PgTCharacterStringBuilderInitial<TName extends string> = PgTCharacterStringBuilder<{
	name: TName;
	data: string;
	driverParam: Character<number>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTCharacterBuilderHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTCharacterStringBuilder";

	constructor(name: string, config: PgTCharacterConfig) {
		super(name);
		this.config.length = config.length;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterString<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTCharacterString<T extends ColumnBaseConfig> extends PgColumn<PgTCharacterHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTCharacterString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "char" : `char(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Character.setN(this.config.length).from(value as string).postgres;
		return Character.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = this.config.length === undefined ? Character.safeFrom(value as string) : Character.setN(this.config.length).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineCharacter<TName extends string, TMode extends PgTCharacterConfig["mode"] & {}>(
	name: TName,
	config?: PgTCharacterConfig<TMode>
): Equal<TMode, "Character"> extends true ? PgTCharacterBuilderInitial<TName> : PgTCharacterStringBuilderInitial<TName>;
export function defineCharacter(name: string, config: PgTCharacterConfig = {}) {
	const { length, mode } = config;
	if (mode === "Character") {
		return new PgTCharacterBuilder(name, {
			length,
		});
	}
	return new PgTCharacterStringBuilder(name, { length });
}
