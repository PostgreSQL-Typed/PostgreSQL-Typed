import { Enum } from "@postgresql-typed/parsers";
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

export interface PgTEnumConfig<
	TMode extends "Enum" | "string" = "Enum" | "string",
	TEnumType extends string = string,
	TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]> = [TEnumType, ...TEnumType[]],
> {
	mode?: TMode;
	enumValues: TEnumValues;
	enumName: string;
}

export type PgTEnumType<
	TTableName extends string,
	TName extends string,
	TMode extends "Enum" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Enum" ? Enum<string, [string, ...string[]]> : string,
	TDriverParameter = Enum<string, [string, ...string[]]>,
> = PgTEnum<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTEnumBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTEnumBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTEnumHKT;
}
export interface PgTEnumHKT extends ColumnHKTBase {
	_type: PgTEnum<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Enum
export type PgTEnumBuilderInitial<TName extends string, EnumType extends string, EnumValues extends Readonly<[EnumType, ...EnumType[]]>> = PgTEnumBuilder<{
	name: TName;
	data: Enum<EnumType, EnumValues>;
	driverParam: Enum<EnumType, EnumValues>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTEnumBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<
	PgTEnumBuilderHKT,
	T,
	{ enumValues: [string, ...string[]]; enumName: string }
> {
	static readonly [entityKind]: string = "PgTEnumBuilder";

	constructor(name: string, config: PgTEnumConfig) {
		super(name);
		this.config.enumValues = config.enumValues;
		this.config.enumName = config.enumName;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTEnum<MakeColumnConfig<T, TTableName>> {
		return new PgTEnum<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTEnum<T extends ColumnBaseConfig> extends PgColumn<PgTEnumHKT, T, { enumValues: [string, ...string[]]; enumName: string }> {
	static readonly [entityKind]: string = "PgTEnum";

	readonly enumValues = this.config.enumValues;
	readonly enumName = this.config.enumName;

	getSQLType(): string {
		return this.enumName;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Enum.setEnums(this.config.enumValues).from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Enum.setEnums(this.config.enumValues).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Enum as string
export type PgTEnumStringBuilderInitial<
	TName extends string,
	TEnumType extends string,
	TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]>,
> = PgTEnumStringBuilder<{
	name: TName;
	data: TEnumValues[number];
	driverParam: Enum<TEnumType, TEnumValues>;
	notNull: false;
	hasDefault: false;
}>;

export class PgTEnumStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<
	PgTEnumBuilderHKT,
	T,
	{ enumValues: [string, ...string[]]; enumName: string }
> {
	static readonly [entityKind]: string = "PgTEnumStringBuilder";

	constructor(name: string, config: PgTEnumConfig) {
		super(name);
		this.config.enumValues = config.enumValues;
		this.config.enumName = config.enumName;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTEnumString<MakeColumnConfig<T, TTableName>> {
		return new PgTEnumString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTEnumString<T extends ColumnBaseConfig> extends PgColumn<PgTEnumHKT, T, { enumValues: [string, ...string[]]; enumName: string }> {
	static readonly [entityKind]: string = "PgTEnumString";

	readonly enumValues = this.config.enumValues;
	readonly enumName = this.config.enumName;

	getSQLType(): string {
		return this.enumName;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Enum.setEnums(this.config.enumValues).from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Enum.setEnums(this.config.enumValues).safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineEnum<
	TName extends string,
	TEnumType extends string,
	TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]>,
	// eslint-disable-next-line @typescript-eslint/ban-types
	TMode extends PgTEnumConfig["mode"] & {},
>(
	name: TName,
	config: PgTEnumConfig<TMode, TEnumType, TEnumValues>
): Equal<TMode, "Enum"> extends true ? PgTEnumBuilderInitial<TName, TEnumType, TEnumValues> : PgTEnumStringBuilderInitial<TName, TEnumType, TEnumValues>;
export function defineEnum(name: string, config: PgTEnumConfig) {
	const { enumValues, mode, enumName } = config;
	if (mode === "Enum") {
		return new PgTEnumBuilder(name, {
			enumName,
			enumValues,
		});
	}
	return new PgTEnumStringBuilder(name, { enumName, enumValues });
}
