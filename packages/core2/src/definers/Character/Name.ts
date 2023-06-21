/* eslint-disable unicorn/filename-case */
import { Name } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTNameConfig<TMode extends "Name" | "string" = "Name" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Name
export type PgTNameBuilderInitial<TName extends string> = PgTNameBuilder<{
	name: TName;
	data: Name;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTNameBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTNameBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTName<MakeColumnConfig<T, TTableName>> {
		return new PgTName<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTName<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTName";

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

export class PgTNameStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTNameStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTNameString<MakeColumnConfig<T, TTableName>> {
		return new PgTNameString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTNameString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTNameString";

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
	if (config.mode === "Name") return new PgTNameBuilder(name, {});
	return new PgTNameStringBuilder(name, {});
}
