import { Enum } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig, Writable } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export interface PgTEnumConfig<TValues extends [string, ...string[]] = [string, ...string[]]> {
	enumName: string;
	enumValues: TValues;
}

//#region Enum
export type PgTEnumBuilderInitial<TName extends string, TEnumType extends string, TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]>> = PgTEnumBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTEnum";
	data: Enum<TEnumType, TEnumValues>;
	driverParam: Enum<TEnumType, TEnumValues>;
	enumValues: undefined;
}>;

export class PgTEnumBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTEnum">> extends PgTColumnBuilder<
	T,
	{ enumName: string; enumValues: [string, ...string[]] }
> {
	static readonly [entityKind]: string = "PgTEnumBuilder";

	constructor(name: T["name"], config: PgTEnumConfig) {
		super(name, "custom", "PgTEnum");
		this.config.enumName = config.enumName;
		this.config.enumValues = config.enumValues;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTEnum<MakeColumnConfig<T, TTableName>> {
		return new PgTEnum<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTEnum<T extends ColumnBaseConfig<"custom", "PgTEnum">> extends PgTColumn<T, { enumName: string; enumValues: [string, ...string[]] }> {
	static readonly [entityKind]: string = "PgTEnum";

	readonly enumName = this.config.enumName;
	readonly enumValues = this.config.enumValues;

	getSQLType(): string {
		return this.enumName;
	}

	override mapFromDriverValue(value: Enum<string, [string, ...string[]]>): Enum<string, [string, ...string[]]> {
		return Enum.setEnums(this.enumValues).from(value);
	}

	override mapToDriverValue(value: Enum<string, [string, ...string[]]>): Enum<string, [string, ...string[]]> {
		const result = Enum.setEnums(this.enumValues).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTEnumStringBuilderInitial<
	TName extends string,
	TEnumType extends string,
	TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]>,
> = PgTEnumStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTEnumString";
	data: TEnumValues[number];
	driverParam: Enum<TEnumType, TEnumValues>;
	enumValues: undefined;
}>;

export class PgTEnumStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTEnumString">> extends PgTColumnBuilder<
	T,
	{ enumName: string; enumValues: [string, ...string[]] }
> {
	static readonly [entityKind]: string = "PgTEnumStringBuilder";

	constructor(name: T["name"], config: PgTEnumConfig) {
		super(name, "string", "PgTEnumString");
		this.config.enumName = config.enumName;
		this.config.enumValues = config.enumValues;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTEnumString<MakeColumnConfig<T, TTableName>> {
		return new PgTEnumString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTEnumString<T extends ColumnBaseConfig<"string", "PgTEnumString">> extends PgTColumn<
	T,
	{ enumName: string; enumValues: [string, ...string[]] }
> {
	static readonly [entityKind]: string = "PgTEnumString";

	readonly enumName = this.config.enumName;
	readonly enumValues = this.config.enumValues;

	getSQLType(): string {
		return this.enumName;
	}

	override mapFromDriverValue(value: Enum<string, [string, ...string[]]>): string {
		return Enum.setEnums(this.enumValues).from(value).postgres;
	}

	override mapToDriverValue(value: string): Enum<string, [string, ...string[]]> {
		const result = Enum.setEnums(this.enumValues).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineEnum<TName extends string, TEnumType extends string, TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]>>(
	name: TName,
	config: { mode: "Enum"; enumName: string; enumValues: TEnumValues | Writable<TEnumValues> }
): PgTEnumBuilderInitial<TName, TEnumType, TEnumValues>;
export function defineEnum<TName extends string, TEnumType extends string, TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]>>(
	name: TName,
	config: { mode?: "string"; enumName: string; enumValues: TEnumValues | Writable<TEnumValues> }
): PgTEnumStringBuilderInitial<TName, TEnumType, TEnumValues>;
export function defineEnum<TName extends string, TEnumType extends string, TEnumValues extends Readonly<[TEnumType, ...TEnumType[]]>>(
	name: TName,
	config: { mode?: "Enum" | "string"; enumName: string; enumValues: TEnumValues | Writable<TEnumValues> }
) {
	if (config.mode === "Enum")
		return new PgTEnumBuilder(name, { enumName: config.enumName, enumValues: [...config.enumValues] }) as PgTEnumBuilderInitial<TName, TEnumType, TEnumValues>;
	return new PgTEnumStringBuilder(name, { enumName: config.enumName, enumValues: [...config.enumValues] }) as PgTEnumStringBuilderInitial<
		TName,
		TEnumType,
		TEnumValues
	>;
}
