/* eslint-disable unicorn/filename-case */
import { Circle } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTCircleConfig<TMode extends "Circle" | "string" = "Circle" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Circle
export type PgTCircleBuilderInitial<TName extends string> = PgTCircleBuilder<{
	name: TName;
	data: Circle;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCircleBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCircleBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCircle<MakeColumnConfig<T, TTableName>> {
		return new PgTCircle<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTCircle<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCircle";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Circle.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Circle.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Circle as string
export type PgTCircleStringBuilderInitial<TName extends string> = PgTCircleStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCircleStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCircleStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTCircleString<MakeColumnConfig<T, TTableName>> {
		return new PgTCircleString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTCircleString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTCircleString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Circle.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Circle.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineCircle<TName extends string, TMode extends PgTCircleConfig["mode"] & {}>(
	name: TName,
	config?: PgTCircleConfig<TMode>
): Equal<TMode, "Circle"> extends true ? PgTCircleBuilderInitial<TName> : PgTCircleStringBuilderInitial<TName>;
export function defineCircle(name: string, config: PgTCircleConfig = {}) {
	if (config.mode === "Circle") return new PgTCircleBuilder(name, {});
	return new PgTCircleStringBuilder(name, {});
}
