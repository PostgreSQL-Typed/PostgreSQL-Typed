/* eslint-disable unicorn/filename-case */
import { Box } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTBoxConfig<TMode extends "Box" | "string" = "Box" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Box
export type PgTBoxBuilderInitial<TName extends string> = PgTBoxBuilder<{
	name: TName;
	data: Box;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBoxBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTBoxBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBox<MakeColumnConfig<T, TTableName>> {
		return new PgTBox<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBox<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTBox";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Box.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Box.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Box as string
export type PgTBoxStringBuilderInitial<TName extends string> = PgTBoxStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBoxStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTBoxStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBoxString<MakeColumnConfig<T, TTableName>> {
		return new PgTBoxString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTBoxString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTBoxString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Box.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Box.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineBox<TName extends string, TMode extends PgTBoxConfig["mode"] & {}>(
	name: TName,
	config?: PgTBoxConfig<TMode>
): Equal<TMode, "Box"> extends true ? PgTBoxBuilderInitial<TName> : PgTBoxStringBuilderInitial<TName>;
export function defineBox(name: string, config: PgTBoxConfig = {}) {
	if (config.mode === "Box") return new PgTBoxBuilder(name, {});
	return new PgTBoxStringBuilder(name, {});
}
