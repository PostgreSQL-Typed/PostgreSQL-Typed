/* eslint-disable unicorn/filename-case */
import { BigNumber, Float4 } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgColumn, PgRealBuilder, PgRealHKT } from "drizzle-orm/pg-core";

export interface PgTFloat4Config<TMode extends "Float4" | "string" | "BigNumber" | "number" = "Float4" | "string" | "BigNumber" | "number"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Float4
export type PgTFloat4BuilderInitial<TName extends string> = PgTFloat4Builder<{
	name: TName;
	data: Float4;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4Builder<T extends ColumnBuilderBaseConfig> extends PgRealBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4Builder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat4<T extends ColumnBaseConfig> extends PgColumn<PgRealHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float4.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Float4 as string
export type PgTFloat4StringBuilderInitial<TName extends string> = PgTFloat4StringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4StringBuilder<T extends ColumnBuilderBaseConfig> extends PgRealBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4StringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4String<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4String<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat4String<T extends ColumnBaseConfig> extends PgColumn<PgRealHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4String";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float4.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Float4 as BigNumber
export type PgTFloat4BigNumberBuilderInitial<TName extends string> = PgTFloat4BigNumberBuilder<{
	name: TName;
	data: BigNumber;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4BigNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgRealBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4BigNumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4BigNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4BigNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat4BigNumber<T extends ColumnBaseConfig> extends PgColumn<PgRealHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4BigNumber";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string).toBigNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float4.from(value as BigNumber).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Float4 as number
export type PgTFloat4NumberBuilderInitial<TName extends string> = PgTFloat4NumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat4NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgRealBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4NumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat4Number<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat4Number<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat4Number<T extends ColumnBaseConfig> extends PgColumn<PgRealHKT, T> {
	static readonly [entityKind]: string = "PgTFloat4Number";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float4.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float4.from(value as number).postgres;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineFloat4<TName extends string, TMode extends PgTFloat4Config["mode"] & {}>(
	name: TName,
	config?: PgTFloat4Config<TMode>
): Equal<TMode, "Float4"> extends true
	? PgTFloat4BuilderInitial<TName>
	: Equal<TMode, "BigNumber"> extends true
	? PgTFloat4BigNumberBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTFloat4StringBuilderInitial<TName>
	: PgTFloat4NumberBuilderInitial<TName>;
export function defineFloat4(name: string, config: PgTFloat4Config = {}) {
	if (config.mode === "Float4") return new PgTFloat4Builder(name);
	if (config.mode === "BigNumber") return new PgTFloat4BigNumberBuilder(name);
	if (config.mode === "string") return new PgTFloat4StringBuilder(name);
	return new PgTFloat4NumberBuilder(name);
}
