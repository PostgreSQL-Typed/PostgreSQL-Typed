/* eslint-disable unicorn/filename-case */
import { Point } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTPointConfig<TMode extends "Point" | "string" = "Point" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Point
export type PgTPointBuilderInitial<TName extends string> = PgTPointBuilder<{
	name: TName;
	data: Point;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPointBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPointBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTPoint<MakeColumnConfig<T, TTableName>> {
		return new PgTPoint<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTPoint<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPoint";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Point.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Point.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Point as string
export type PgTPointStringBuilderInitial<TName extends string> = PgTPointStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPointStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPointStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTPointString<MakeColumnConfig<T, TTableName>> {
		return new PgTPointString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTPointString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPointString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Point.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Point.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function definePoint<TName extends string, TMode extends PgTPointConfig["mode"] & {}>(
	name: TName,
	config?: PgTPointConfig<TMode>
): Equal<TMode, "Point"> extends true ? PgTPointBuilderInitial<TName> : PgTPointStringBuilderInitial<TName>;
export function definePoint(name: string, config: PgTPointConfig = {}) {
	if (config.mode === "Point") return new PgTPointBuilder(name, {});
	return new PgTPointStringBuilder(name, {});
}
