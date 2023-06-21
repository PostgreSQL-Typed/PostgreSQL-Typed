/* eslint-disable unicorn/filename-case */
import { Int8 } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgBigInt64Builder, PgBigInt64HKT, PgColumn } from "drizzle-orm/pg-core";

export interface PgTInt8Config<TMode extends "Int8" | "string" | "BigInt" | "number" = "Int8" | "string" | "BigInt" | "number"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Int8
export type PgTInt8BuilderInitial<TName extends string> = PgTInt8Builder<{
	name: TName;
	data: Int8;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8Builder<T extends ColumnBuilderBaseConfig> extends PgBigInt64Builder<T> {
	static readonly [entityKind]: string = "PgTInt8Builder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8<T extends ColumnBaseConfig> extends PgColumn<PgBigInt64HKT, T> {
	static readonly [entityKind]: string = "PgTInt8";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8 as string
export type PgTInt8StringBuilderInitial<TName extends string> = PgTInt8StringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8StringBuilder<T extends ColumnBuilderBaseConfig> extends PgBigInt64Builder<T> {
	static readonly [entityKind]: string = "PgTInt8StringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8String<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8String<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8String<T extends ColumnBaseConfig> extends PgColumn<PgBigInt64HKT, T> {
	static readonly [entityKind]: string = "PgTInt8String";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8 as BigInt
export type PgTInt8BigIntBuilderInitial<TName extends string> = PgTInt8BigIntBuilder<{
	name: TName;
	data: bigint;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8BigIntBuilder<T extends ColumnBuilderBaseConfig> extends PgBigInt64Builder<T> {
	static readonly [entityKind]: string = "PgTInt8BigIntBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8BigInt<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8BigInt<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8BigInt<T extends ColumnBaseConfig> extends PgColumn<PgBigInt64HKT, T> {
	static readonly [entityKind]: string = "PgTInt8BigInt";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string).toBigint();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8.from(value as bigint).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8 as number
export type PgTInt8NumberBuilderInitial<TName extends string> = PgTInt8NumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgBigInt64Builder<T> {
	static readonly [entityKind]: string = "PgTInt8NumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8Number<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8Number<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8Number<T extends ColumnBaseConfig> extends PgColumn<PgBigInt64HKT, T> {
	static readonly [entityKind]: string = "PgTInt8Number";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8.from(value as number).postgres;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt8<TName extends string, TMode extends PgTInt8Config["mode"] & {}>(
	name: TName,
	config?: PgTInt8Config<TMode>
): Equal<TMode, "Int8"> extends true
	? PgTInt8BuilderInitial<TName>
	: Equal<TMode, "BigInt"> extends true
	? PgTInt8BigIntBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTInt8StringBuilderInitial<TName>
	: PgTInt8NumberBuilderInitial<TName>;
export function defineInt8(name: string, config: PgTInt8Config = {}) {
	if (config.mode === "Int8") return new PgTInt8Builder(name);
	if (config.mode === "BigInt") return new PgTInt8BigIntBuilder(name);
	if (config.mode === "string") return new PgTInt8StringBuilder(name);
	return new PgTInt8NumberBuilder(name);
}
