/* eslint-disable unicorn/filename-case */
import { Int8MultiRange } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTInt8MultiRangeConfig<TMode extends "Int8MultiRange" | "string" = "Int8MultiRange" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Int8MultiRange
export type PgTInt8MultiRangeBuilderInitial<TName extends string> = PgTInt8MultiRangeBuilder<{
	name: TName;
	data: Int8MultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8MultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8MultiRange<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8MultiRange<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8MultiRange<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8MultiRange";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8MultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8MultiRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8MultiRange as string
export type PgTInt8MultiRangeStringBuilderInitial<TName extends string> = PgTInt8MultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8MultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInt8MultiRangeString<MakeColumnConfig<T, TTableName>> {
		return new PgTInt8MultiRangeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInt8MultiRangeString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8MultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int8MultiRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt8MultiRange<TName extends string, TMode extends PgTInt8MultiRangeConfig["mode"] & {}>(
	name: TName,
	config?: PgTInt8MultiRangeConfig<TMode>
): Equal<TMode, "Int8MultiRange"> extends true ? PgTInt8MultiRangeBuilderInitial<TName> : PgTInt8MultiRangeStringBuilderInitial<TName>;
export function defineInt8MultiRange(name: string, config: PgTInt8MultiRangeConfig = {}) {
	if (config.mode === "Int8MultiRange") return new PgTInt8MultiRangeBuilder(name, {});
	return new PgTInt8MultiRangeStringBuilder(name, {});
}
