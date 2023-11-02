import { CharacterVarying } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export interface PgTCharacterVaryingConfig {
	length?: number;
}

export type PgTCharacterVaryingType<
	TTableName extends string,
	TName extends string,
	TMode extends "CharacterVarying" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "CharacterVarying" ? CharacterVarying<number> : string,
	TDriverParameter = CharacterVarying<number>,
	TColumnType extends "PgTCharacterVarying" = "PgTCharacterVarying",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTCharacterVarying<{
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

//#region CharacterVarying
export type PgTCharacterVaryingBuilderInitial<TName extends string> = PgTCharacterVaryingBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTCharacterVarying";
	data: CharacterVarying<number>;
	driverParam: CharacterVarying<number>;
	enumValues: undefined;
}>;

export class PgTCharacterVaryingBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTCharacterVarying">> extends PgTColumnBuilder<
	T,
	{ length: number | undefined }
> {
	static readonly [entityKind]: string = "PgTCharacterVaryingBuilder";

	constructor(name: T["name"], config: PgTCharacterVaryingConfig) {
		super(name, "custom", "PgTCharacterVarying");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterVarying<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterVarying<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTCharacterVarying<T extends ColumnBaseConfig<"custom", "PgTCharacterVarying">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTCharacterVarying";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varchar" : `varchar(${this.length})`;
	}

	override mapFromDriverValue(value: CharacterVarying<number>): CharacterVarying<number> {
		return this.length === undefined ? CharacterVarying.from(value) : CharacterVarying.setN(this.length).from(value);
	}

	override mapToDriverValue(value: CharacterVarying<number>): CharacterVarying<number> {
		const result = this.length === undefined ? CharacterVarying.safeFrom(value) : CharacterVarying.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTCharacterVaryingStringBuilderInitial<TName extends string> = PgTCharacterVaryingStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTCharacterVaryingString";
	data: string;
	driverParam: CharacterVarying<number>;
	enumValues: undefined;
}>;

export class PgTCharacterVaryingStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTCharacterVaryingString">> extends PgTColumnBuilder<
	T,
	{ length: number | undefined }
> {
	static readonly [entityKind]: string = "PgTCharacterVaryingStringBuilder";

	constructor(name: T["name"], config: PgTCharacterVaryingConfig) {
		super(name, "string", "PgTCharacterVaryingString");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterVaryingString<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterVaryingString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTCharacterVaryingString<T extends ColumnBaseConfig<"string", "PgTCharacterVaryingString">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTCharacterVaryingString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varchar" : `varchar(${this.length})`;
	}

	override mapFromDriverValue(value: CharacterVarying<number>): string {
		return (this.length === undefined ? CharacterVarying.from(value) : CharacterVarying.setN(this.length).from(value)).postgres;
	}

	override mapToDriverValue(value: string): CharacterVarying<number> {
		const result = this.length === undefined ? CharacterVarying.safeFrom(value) : CharacterVarying.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineCharacterVarying<TName extends string>(
	name: TName,
	config?: { mode: "string"; length?: number }
): PgTCharacterVaryingStringBuilderInitial<TName>;
export function defineCharacterVarying<TName extends string>(
	name: TName,
	config?: { mode: "CharacterVarying"; length?: number }
): PgTCharacterVaryingBuilderInitial<TName>;
export function defineCharacterVarying<TName extends string>(name: TName, config?: { mode: "CharacterVarying" | "string"; length?: number }) {
	if (config?.mode === "CharacterVarying") return new PgTCharacterVaryingBuilder(name, { length: config.length }) as PgTCharacterVaryingBuilderInitial<TName>;
	return new PgTCharacterVaryingStringBuilder(name, { length: config?.length }) as PgTCharacterVaryingStringBuilderInitial<TName>;
}
