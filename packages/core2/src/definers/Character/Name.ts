import { Name } from "@postgresql-typed/parsers";
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
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

export interface PgTNameConfig<TMode extends "Name" | "string" = "Name" | "string"> {
	mode?: TMode;
}
export interface PgTNameBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTNameBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTNameHKT;
}
export interface PgTNameHKT extends ColumnHKTBase {
	_type: PgTName<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Name
export type PgTNameBuilderInitial<TName extends string> = PgTNameBuilder<{
	name: TName;
	data: Name;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTNameBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTNameBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTNameBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTName<MakeColumnConfig<T, TTableName>> {
		return new PgTName<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTName<T extends ColumnBaseConfig> extends PgColumn<PgTNameHKT, T> {
	static readonly [entityKind]: string = "PgTName";

	getSQLType(): string {
		return "name";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Name.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Name.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Name as string
export type PgTNameStringBuilderInitial<TName extends string> = PgTNameStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTNameStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTNameBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTNameStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTNameString<MakeColumnConfig<T, TTableName>> {
		return new PgTNameString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTNameString<T extends ColumnBaseConfig> extends PgColumn<PgTNameHKT, T> {
	static readonly [entityKind]: string = "PgTNameString";

	getSQLType(): string {
		return "name";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Name.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Name.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineName<TName extends string, TMode extends PgTNameConfig["mode"] & {}>(
	name: TName,
	config?: PgTNameConfig<TMode>
): Equal<TMode, "Name"> extends true ? PgTNameBuilderInitial<TName> : PgTNameStringBuilderInitial<TName>;
export function defineName(name: string, config: PgTNameConfig = {}) {
	if (config.mode === "Name") return new PgTNameBuilder(name);
	return new PgTNameStringBuilder(name);
}
