/* eslint-disable unicorn/filename-case */
import { Bit } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgCharBuilder, PgCharHKT, PgColumn } from "drizzle-orm/pg-core";

export interface PgTBitConfig<TMode extends "Bit" | "string" | "number" = "Bit" | "string" | "number"> {
	mode?: TMode;
	length?: number;
}

//#region @postgresql-typed/parsers Bit
export type PgTBitBuilderInitial<TName extends string> = PgTBitBuilder<{
	name: TName;
	data: Bit<number>;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitBuilder<T extends ColumnBuilderBaseConfig> extends PgCharBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTBitBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBit<MakeColumnConfig<T, TTableName>> {
		return new PgTBit<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBit<T extends ColumnBaseConfig> extends PgColumn<PgCharHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBit";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Bit.setN(this.config.length).from(value as string);
		return Bit.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return Bit.setN(this.config.length).from(value as string).postgres;
		return Bit.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Bit as string
export type PgTBitStringBuilderInitial<TName extends string> = PgTBitStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitStringBuilder<T extends ColumnBuilderBaseConfig> extends PgCharBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTBitStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitString<MakeColumnConfig<T, TTableName>> {
		return new PgTBitString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBitString<T extends ColumnBaseConfig> extends PgColumn<PgCharHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) return Bit.setN(this.config.length).from(value as string).postgres;
		return Bit.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return Bit.setN(this.config.length).from(value as string).postgres;
		return Bit.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Bit as number
export type PgTBitNumberBuilderInitial<TName extends string> = PgTBitNumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBitNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgCharBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTBitNumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTBitNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBitNumber<T extends ColumnBaseConfig> extends PgColumn<PgCharHKT, T, { length?: number }> {
	static readonly [entityKind]: string = "PgTBitNumber";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		if (this.config.length !== undefined) {
			return Bit.setN(this.config.length)
				.from(value as string)
				.toNumber();
		}
		return Bit.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		if (this.config.length !== undefined) return Bit.setN(this.config.length).from(value as string).postgres;
		return Bit.from(value as string).postgres;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineBit<TName extends string, TMode extends PgTBitConfig["mode"] & {}>(
	name: TName,
	config?: PgTBitConfig<TMode>
): Equal<TMode, "Bit"> extends true
	? PgTBitBuilderInitial<TName>
	: Equal<TMode, "number"> extends true
	? PgTBitNumberBuilderInitial<TName>
	: PgTBitStringBuilderInitial<TName>;
export function defineBit(name: string, config: PgTBitConfig = {}) {
	const { length, mode } = config;
	if (mode === "Bit") {
		return new PgTBitBuilder(name, {
			length,
		});
	}
	if (mode === "number") {
		return new PgTBitNumberBuilder(name, {
			length,
		});
	}
	return new PgTBitStringBuilder(name, { length });
}