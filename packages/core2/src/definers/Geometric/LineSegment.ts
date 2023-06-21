/* eslint-disable unicorn/filename-case */
import { LineSegment } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTLineSegmentConfig<TMode extends "LineSegment" | "string" = "LineSegment" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers LineSegment
export type PgTLineSegmentBuilderInitial<TName extends string> = PgTLineSegmentBuilder<{
	name: TName;
	data: LineSegment;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineSegmentBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLineSegmentBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTLineSegment<MakeColumnConfig<T, TTableName>> {
		return new PgTLineSegment<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTLineSegment<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLineSegment";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return LineSegment.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return LineSegment.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers LineSegment as string
export type PgTLineSegmentStringBuilderInitial<TName extends string> = PgTLineSegmentStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineSegmentStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLineSegmentStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTLineSegmentString<MakeColumnConfig<T, TTableName>> {
		return new PgTLineSegmentString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTLineSegmentString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTLineSegmentString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return LineSegment.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return LineSegment.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineLineSegment<TName extends string, TMode extends PgTLineSegmentConfig["mode"] & {}>(
	name: TName,
	config?: PgTLineSegmentConfig<TMode>
): Equal<TMode, "LineSegment"> extends true ? PgTLineSegmentBuilderInitial<TName> : PgTLineSegmentStringBuilderInitial<TName>;
export function defineLineSegment(name: string, config: PgTLineSegmentConfig = {}) {
	if (config.mode === "LineSegment") return new PgTLineSegmentBuilder(name, {});
	return new PgTLineSegmentStringBuilder(name, {});
}
