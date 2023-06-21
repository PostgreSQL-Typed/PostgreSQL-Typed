/* eslint-disable unicorn/filename-case */
import { Line } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTLineConfig<TMode extends "Line" | "string" = "Line" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Line
export type PgTLineBuilderInitial<TName extends string> = PgTLineBuilder<{
	name: TName;
	data: Line;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLineBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTLine<MakeColumnConfig<T, TTableName>> {
		return new PgTLine<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTLine<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLine";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Line.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Line.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Line as string
export type PgTLineStringBuilderInitial<TName extends string> = PgTLineStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLineStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTLineString<MakeColumnConfig<T, TTableName>> {
		return new PgTLineString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTLineString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLineString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Line.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Line.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineLine<TName extends string, TMode extends PgTLineConfig["mode"] & {}>(
	name: TName,
	config?: PgTLineConfig<TMode>
): Equal<TMode, "Line"> extends true ? PgTLineBuilderInitial<TName> : PgTLineStringBuilderInitial<TName>;
export function defineLine(name: string, config: PgTLineConfig = {}) {
	if (config.mode === "Line") return new PgTLineBuilder(name, {});
	return new PgTLineStringBuilder(name, {});
}
