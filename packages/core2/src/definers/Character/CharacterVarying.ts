/* eslint-disable unicorn/filename-case */
import { CharacterVarying } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgVarchar, PgVarcharBuilder } from "drizzle-orm/pg-core";

export interface PgTCharacterVaryingConfig<TMode extends "CharacterVarying" | "string" = "CharacterVarying" | "string"> {
	mode?: TMode;
	length?: number;
}

//#region @postgresql-typed/parsers CharacterVarying
export type PgTCharacterVaryingBuilderInitial<TName extends string> = PgTCharacterVaryingBuilder<{
	name: TName;
	data: CharacterVarying<number>;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterVaryingBuilder<T extends ColumnBuilderBaseConfig> extends PgVarcharBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacterVaryingBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterVarying<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterVarying<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTCharacterVarying<T extends ColumnBaseConfig> extends PgVarchar<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacterVarying";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return CharacterVarying.setN(this.config.length).from(value as string);
		return CharacterVarying.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return CharacterVarying.setN(this.config.length).from(value as string).postgres;
		return CharacterVarying.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers CharacterVarying as string
export type PgTCharacterVaryingStringBuilderInitial<TName extends string> = PgTCharacterVaryingStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterVaryingStringBuilder<T extends ColumnBuilderBaseConfig> extends PgVarcharBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacterVaryingStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterVaryingString<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterVaryingString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTCharacterVaryingString<T extends ColumnBaseConfig> extends PgVarchar<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacterVaryingString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return CharacterVarying.setN(this.config.length).from(value as string).postgres;
		return CharacterVarying.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return CharacterVarying.setN(this.config.length).from(value as string).postgres;
		return CharacterVarying.from(value as string).postgres;
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
