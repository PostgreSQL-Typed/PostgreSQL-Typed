/* eslint-disable unicorn/filename-case */
import { Polygon } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTPolygonConfig<TMode extends "Polygon" | "string" = "Polygon" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Polygon
export type PgTPolygonBuilderInitial<TName extends string> = PgTPolygonBuilder<{
	name: TName;
	data: Polygon;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPolygonBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPolygonBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTPolygon<MakeColumnConfig<T, TTableName>> {
		return new PgTPolygon<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTPolygon<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPolygon";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Polygon.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Polygon.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Polygon as string
export type PgTPolygonStringBuilderInitial<TName extends string> = PgTPolygonStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPolygonStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPolygonStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTPolygonString<MakeColumnConfig<T, TTableName>> {
		return new PgTPolygonString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTPolygonString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPolygonString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Polygon.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Polygon.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function definePolygon<TName extends string, TMode extends PgTPolygonConfig["mode"] & {}>(
	name: TName,
	config?: PgTPolygonConfig<TMode>
): Equal<TMode, "Polygon"> extends true ? PgTPolygonBuilderInitial<TName> : PgTPolygonStringBuilderInitial<TName>;
export function definePolygon(name: string, config: PgTPolygonConfig = {}) {
	if (config.mode === "Polygon") return new PgTPolygonBuilder(name, {});
	return new PgTPolygonStringBuilder(name, {});
}
