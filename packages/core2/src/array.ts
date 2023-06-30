/* eslint-disable unicorn/no-null */
import {
	AnyColumnBuilder,
	Assume,
	BuildColumn,
	ColumnBaseConfig,
	ColumnBuilderBaseConfig,
	ColumnBuilderHKTBase,
	ColumnHKTBase,
	entityKind,
	MakeColumnConfig,
} from "drizzle-orm";
import { AnyPgColumn, AnyPgTable, parsePgArray, PgColumn, PgColumnBuilder, PgColumnBuilderHKT } from "drizzle-orm/pg-core";

export interface PgTArrayBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTArrayBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTArrayHKT;
}

export interface PgTArrayHKT extends ColumnHKTBase {
	_type: PgTArray<Assume<this["config"], ColumnBaseConfig>>;
}

export class PgTArrayBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<
	PgTArrayBuilderHKT,
	T,
	{
		baseBuilder: PgColumnBuilder<
			PgColumnBuilderHKT,
			{
				name: T["name"];
				notNull: T["notNull"];
				hasDefault: T["hasDefault"];
				data: Assume<T["data"], unknown[]>[number];
				driverParam: string | Assume<T["driverParam"], unknown[]>[number];
			}
		>;
		size: number | undefined;
	}
> {
	static override readonly [entityKind] = "PgTArrayBuilder";

	constructor(name: string, baseBuilder: PgTArrayBuilder<T>["config"]["baseBuilder"], size: number | undefined) {
		super(name);
		this.config.baseBuilder = baseBuilder;
		this.config.size = size;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTArray<MakeColumnConfig<T, TTableName>> {
		//@ts-expect-error - It does exist
		const baseColumn = this.config.baseBuilder.build(table);
		return new PgTArray<MakeColumnConfig<T, TTableName>>(table, this.config, baseColumn);
	}
}

export class PgTArray<T extends ColumnBaseConfig> extends PgColumn<
	PgTArrayHKT,
	T,
	// eslint-disable-next-line @typescript-eslint/ban-types
	{},
	{
		baseColumn: BuildColumn<
			string,
			Assume<
				PgColumnBuilder<
					PgColumnBuilderHKT,
					{
						name: T["name"];
						notNull: T["notNull"];
						hasDefault: T["hasDefault"];
						data: Assume<T["data"], unknown[]>[number];
						driverParam: string | Assume<T["driverParam"], unknown[]>[number];
					}
				>,
				AnyColumnBuilder
			>
		>;
	}
> {
	protected declare $pgColumnBrand: "PgArray";

	readonly size: number | undefined;

	static readonly [entityKind]: string = "PgArray";

	constructor(
		table: AnyPgTable<{ name: T["tableName"] }>,
		config: PgTArrayBuilder<T>["config"],
		readonly baseColumn: AnyPgColumn,
		readonly range?: [number | undefined, number | undefined]
	) {
		super(table, config);
		this.size = config.size;
	}

	/* c8 ignore next 3 */
	getSQLType(): string {
		return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
	}

	override mapFromDriverValue(value: unknown[] | string): T["data"] {
		/* c8 ignore next 4 */
		if (typeof value === "string") {
			// Thank you node-postgres for not parsing enum arrays
			value = parsePgArray(value);
		}
		return value.map(v => this.baseColumn.mapFromDriverValue(v));
	}

	override mapToDriverValue(value: unknown[]): unknown[] | string {
		return value.map(v => this.baseColumn.mapToDriverValue(v));
	}
}
