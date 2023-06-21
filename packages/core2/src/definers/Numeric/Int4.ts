/* eslint-disable unicorn/filename-case */
import { Int4 } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgColumn, PgIntegerBuilder, PgIntegerHKT } from "drizzle-orm/pg-core";

export interface PgTInt4Config<TMode extends "Int4" | "string" | "number" = "Int4" | "string" | "number"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Int4
export type PgTInt4BuilderInitial<TName extends string> = PgTInt4Builder<{
	name: TName;
	data: Int4;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4Builder<T extends ColumnBuilderBaseConfig> extends PgIntegerBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4Builder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt4<T extends ColumnBaseConfig> extends PgColumn<PgIntegerHKT, T> {
	static readonly [entityKind]: string = "PgTInt4";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4 as string
export type PgTInt4StringBuilderInitial<TName extends string> = PgTInt4StringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4StringBuilder<T extends ColumnBuilderBaseConfig> extends PgIntegerBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4StringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4String<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4String<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt4String<T extends ColumnBaseConfig> extends PgColumn<PgIntegerHKT, T> {
	static readonly [entityKind]: string = "PgTInt4String";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4 as number
export type PgTInt4NumberBuilderInitial<TName extends string> = PgTInt4NumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgIntegerBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4NumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt4Number<MakeColumnConfig<T, TTableName>> {
		return new PgTInt4Number<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt4Number<T extends ColumnBaseConfig> extends PgColumn<PgIntegerHKT, T> {
	static readonly [entityKind]: string = "PgTInt4Number";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4.from(value as number).postgres;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt4<TName extends string, TMode extends PgTInt4Config["mode"] & {}>(
	name: TName,
	config?: PgTInt4Config<TMode>
): Equal<TMode, "Int4"> extends true
	? PgTInt4BuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTInt4StringBuilderInitial<TName>
	: PgTInt4NumberBuilderInitial<TName>;
export function defineInt4(name: string, config: PgTInt4Config = {}) {
	if (config.mode === "Int4") return new PgTInt4Builder(name);
	if (config.mode === "string") return new PgTInt4StringBuilder(name);
	return new PgTInt4NumberBuilder(name);
}
