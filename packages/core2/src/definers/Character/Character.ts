/* eslint-disable unicorn/filename-case */
import { Character } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgChar, PgCharBuilder } from "drizzle-orm/pg-core";

export interface PgTCharacterConfig<TMode extends "Character" | "string" = "Character" | "string"> {
	mode?: TMode;
	length?: number;
}

//#region @postgresql-typed/parsers Character
export type PgTCharacterBuilderInitial<TName extends string> = PgTCharacterBuilder<{
	name: TName;
	data: Character<number>;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterBuilder<T extends ColumnBuilderBaseConfig> extends PgCharBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacterBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacter<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacter<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTCharacter<T extends ColumnBaseConfig> extends PgChar<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacter";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Character.setN(this.config.length).from(value as string);
		return Character.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return Character.setN(this.config.length).from(value as string).postgres;
		return Character.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Character as string
export type PgTCharacterStringBuilderInitial<TName extends string> = PgTCharacterStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCharacterStringBuilder<T extends ColumnBuilderBaseConfig> extends PgCharBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacterStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCharacterString<MakeColumnConfig<T, TTableName>> {
		return new PgTCharacterString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTCharacterString<T extends ColumnBaseConfig> extends PgChar<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCharacterString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Character.setN(this.config.length).from(value as string).postgres;
		return Character.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return Character.setN(this.config.length).from(value as string).postgres;
		return Character.from(value as string).postgres;
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
