/* eslint-disable unicorn/filename-case */
import { BigNumber, Float8 } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgColumn, PgDoublePrecisionBuilder, PgDoublePrecisionHKT } from "drizzle-orm/pg-core";

export interface PgTFloat8Config<TMode extends "Float8" | "string" | "BigNumber" | "number" = "Float8" | "string" | "BigNumber" | "number"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Float8
export type PgTFloat8BuilderInitial<TName extends string> = PgTFloat8Builder<{
	name: TName;
	data: Float8;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8Builder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8Builder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat8<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float8.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Float8 as string
export type PgTFloat8StringBuilderInitial<TName extends string> = PgTFloat8StringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8StringBuilder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8StringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8String<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8String<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat8String<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8String";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float8.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Float8 as BigNumber
export type PgTFloat8BigNumberBuilderInitial<TName extends string> = PgTFloat8BigNumberBuilder<{
	name: TName;
	data: BigNumber;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8BigNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8BigNumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8BigNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8BigNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat8BigNumber<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8BigNumber";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string).toBigNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float8.from(value as BigNumber).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Float8 as number
export type PgTFloat8NumberBuilderInitial<TName extends string> = PgTFloat8NumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTFloat8NumberBuilder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8NumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTFloat8Number<MakeColumnConfig<T, TTableName>> {
		return new PgTFloat8Number<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTFloat8Number<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTFloat8Number";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Float8.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Float8.from(value as number).postgres;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineFloat8<TName extends string, TMode extends PgTFloat8Config["mode"] & {}>(
	name: TName,
	config?: PgTFloat8Config<TMode>
): Equal<TMode, "Float8"> extends true
	? PgTFloat8BuilderInitial<TName>
	: Equal<TMode, "BigNumber"> extends true
	? PgTFloat8BigNumberBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTFloat8StringBuilderInitial<TName>
	: PgTFloat8NumberBuilderInitial<TName>;
export function defineFloat8(name: string, config: PgTFloat8Config = {}) {
	if (config.mode === "Float8") return new PgTFloat8Builder(name);
	if (config.mode === "BigNumber") return new PgTFloat8BigNumberBuilder(name);
	if (config.mode === "string") return new PgTFloat8StringBuilder(name);
	return new PgTFloat8NumberBuilder(name);
}
