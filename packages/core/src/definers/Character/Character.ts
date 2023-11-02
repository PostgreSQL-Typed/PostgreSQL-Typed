import { Character } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export interface PgTCharacterConfig {
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
	TColumnType extends "PgTCharacter" = "PgTCharacter",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTCharacter<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
	columnType: TColumnType;
	dataType: TDataType;
	enumValues: TEnumValues;
}>;

//#region Character
export type PgTCharacterBuilderInitial<TName extends string> = PgTCharacterBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTCharacter";
	data: Character<number>;
	driverParam: Character<number>;
	enumValues: undefined;
}>;

export class PgTCharacterBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTCharacter">> extends PgTColumnBuilder<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTCharacterBuilder";

	constructor(name: T["name"], config: PgTCharacterConfig) {
		super(name, "custom", "PgTCharacter");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacter<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacter<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTCharacter<T extends ColumnBaseConfig<"custom", "PgTCharacter">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTCharacter";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "char" : `char(${this.length})`;
	}

	override mapFromDriverValue(value: Character<number>): Character<number> {
		return this.length === undefined ? Character.from(value) : Character.setN(this.length).from(value);
	}

	override mapToDriverValue(value: Character<number>): Character<number> {
		const result = this.length === undefined ? Character.safeFrom(value) : Character.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTCharacterStringBuilderInitial<TName extends string> = PgTCharacterStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTCharacterString";
	data: string;
	driverParam: Character<number>;
	enumValues: undefined;
}>;

export class PgTCharacterStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTCharacterString">> extends PgTColumnBuilder<
	T,
	{ length: number | undefined }
> {
	static readonly [entityKind]: string = "PgTCharacterStringBuilder";

	constructor(name: T["name"], config: PgTCharacterConfig) {
		super(name, "string", "PgTCharacterString");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterString<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTCharacterString<T extends ColumnBaseConfig<"string", "PgTCharacterString">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTCharacterString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "char" : `char(${this.length})`;
	}

	override mapFromDriverValue(value: Character<number>): string {
		return (this.length === undefined ? Character.from(value) : Character.setN(this.length).from(value)).postgres;
	}

	override mapToDriverValue(value: string): Character<number> {
		const result = this.length === undefined ? Character.safeFrom(value) : Character.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineCharacter<TName extends string>(name: TName, config?: { mode: "string"; length?: number }): PgTCharacterStringBuilderInitial<TName>;
export function defineCharacter<TName extends string>(name: TName, config?: { mode: "Character"; length?: number }): PgTCharacterBuilderInitial<TName>;
export function defineCharacter<TName extends string>(name: TName, config?: { mode: "Character" | "string"; length?: number }) {
	if (config?.mode === "Character") return new PgTCharacterBuilder(name, { length: config.length }) as PgTCharacterBuilderInitial<TName>;
	return new PgTCharacterStringBuilder(name, { length: config?.length }) as PgTCharacterStringBuilderInitial<TName>;
}
