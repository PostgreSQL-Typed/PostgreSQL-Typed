/* c8 ignore start */
import {
	type AnyColumn,
	type AnyTable,
	type Assume,
	Column,
	type ColumnKind,
	type ColumnsSelection,
	type DrizzleTypeError,
	type Equal,
	type GetColumnData,
	is,
	Param,
	type SelectedFieldsOrdered,
	type SimplifyShallow,
	SQL,
	Subquery,
	SubqueryConfig,
	Table,
	type UpdateColConfig,
	type UpdateSet,
	View,
	ViewBaseConfig,
} from "drizzle-orm";

/** @internal */
export function applyMixins(baseClass: any, extendedClasses: any[]) {
	for (const extendedClass of extendedClasses) {
		for (const name of Object.getOwnPropertyNames(extendedClass.prototype))
			Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null));
	}
}

/** @internal */
export function orderSelectedFields<TColumn extends AnyColumn>(fields: Record<string, unknown>, pathPrefix?: string[]): SelectedFieldsOrdered<TColumn> {
	// eslint-disable-next-line unicorn/no-array-reduce
	return Object.entries(fields).reduce<SelectedFieldsOrdered<AnyColumn>>((result, [name, field]) => {
		if (typeof name !== "string") return result;

		const newPath = pathPrefix ? [...pathPrefix, name] : [name];
		if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) result.push({ path: newPath, field });
		//@ts-expect-error TODO: fix this
		else if (is(field, Table)) result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
		else result.push(...orderSelectedFields(field as Record<string, unknown>, newPath));

		return result;
	}, []) as SelectedFieldsOrdered<TColumn>;
}

/** @internal */
export function mapUpdateSet(table: Table, values: Record<string, unknown>): UpdateSet {
	const entries: [string, UpdateSet[string]][] = Object.entries(values)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => {
			// eslint-disable-next-line unicorn/prefer-ternary
			if (is(value, SQL)) return [key, value];
			//@ts-expect-error - TODO: fix this
			else return [key, new Param(value, (table[Table.Symbol.Columns as keyof typeof table] as typeof table._.columns)[key])];
		});

	if (entries.length === 0) throw new Error("No values to set");

	return Object.fromEntries(entries);
}

export type SelectMode = "partial" | "single" | "multiple";
export type JoinNullability = "nullable" | "not-null";

export type SelectResult<TResult, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability>> = TSelectMode extends "partial"
	? SelectPartialResult<TResult, TNullabilityMap>
	: TSelectMode extends "single"
	? SelectResultFields<TResult>
	: ApplyNotNullMapToJoins<SelectResultFields<TResult>, TNullabilityMap>;

type SelectPartialResult<TFields, TNullability extends Record<string, JoinNullability>> = TNullability extends TNullability
	? {
			[Key in keyof TFields]: TFields[Key] extends infer TField
				? TField extends AnyTable
					? TField["_"]["name"] extends keyof TNullability
						? ApplyNullability<SelectResultFields<TField["_"]["columns"]>, TNullability[TField["_"]["name"]]>
						: never
					: TField extends AnyColumn
					? TField["_"]["tableName"] extends keyof TNullability
						? ApplyNullability<SelectResultField<TField>, TNullability[TField["_"]["tableName"]]>
						: never
					: TField extends SQL | SQL.Aliased
					? SelectResultField<TField>
					: TField extends Record<string, any>
					? TField[keyof TField] extends AnyColumn<{ tableName: infer TTableName extends string }> | SQL | SQL.Aliased
						? Not<IsUnion<TTableName>> extends true
							? ApplyNullability<SelectResultFields<TField>, TNullability[TTableName]>
							: SelectPartialResult<TField, TNullability>
						: never
					: never
				: never;
	  }
	: never;

export type ApplyNullability<T, TNullability extends JoinNullability> = TNullability extends "nullable" ? T | null : TNullability extends "null" ? null : T;

export type ApplyNotNullMapToJoins<TResult, TNullabilityMap extends Record<string, JoinNullability>> = SimplifyShallow<{
	[TTableName in keyof TResult & keyof TNullabilityMap & string]: ApplyNullability<TResult[TTableName], TNullabilityMap[TTableName]>;
}>;

export type SelectResultField<T, TDeep extends boolean = true> = T extends DrizzleTypeError<any>
	? T
	: T extends AnyTable
	? Equal<TDeep, true> extends true
		? SelectResultField<T["_"]["columns"], false>
		: never
	: T extends AnyColumn
	? GetColumnData<T>
	: T extends SQL | SQL.Aliased
	? T["_"]["type"]
	: T extends Record<string, any>
	? SelectResultFields<T, true>
	: never;

export type SelectResultFields<TSelectedFields, TDeep extends boolean = true> = SimplifyShallow<{
	[Key in keyof TSelectedFields & string]: SelectResultField<TSelectedFields[Key], TDeep>;
}>;

type IsUnion<T, U extends T = T> = (T extends any ? (U extends T ? false : true) : never) extends false ? false : true;

type Not<T extends boolean> = T extends true ? false : true;

export type GetSelectTableName<TTable extends AnyTable | Subquery | View | SQL> = TTable extends AnyTable
	? TTable["_"]["name"]
	: TTable extends Subquery
	? TTable["_"]["alias"]
	: TTable extends View
	? TTable["_"]["name"]
	: TTable extends SQL
	? undefined
	: never;

export type GetSelectTableSelection<TTable extends AnyTable | Subquery | View | SQL> = TTable extends AnyTable
	? TTable["_"]["columns"]
	: TTable extends Subquery | View
	? Assume<TTable["_"]["selectedFields"], ColumnsSelection>
	: TTable extends SQL
	? // eslint-disable-next-line @typescript-eslint/ban-types
	  {}
	: never;

export type ApplyNullabilityToColumn<TColumn extends AnyColumn, TNullability extends JoinNullability> = TNullability extends "not-null"
	? TColumn
	: ColumnKind<
			TColumn["_"]["hkt"],
			UpdateColConfig<
				TColumn["_"]["config"],
				{
					notNull: TNullability extends "nullable" ? false : TColumn["_"]["notNull"];
				}
			>
	  >;

export type BuildSubquerySelection<TSelection extends ColumnsSelection, TNullability extends Record<string, JoinNullability>> = TSelection extends never
	? any
	: SimplifyShallow<{
			[Key in keyof TSelection]: TSelection[Key] extends SQL
				? DrizzleTypeError<"You cannot reference this field without assigning it an alias first - use `.as(<alias>)`">
				: TSelection[Key] extends SQL.Aliased
				? TSelection[Key]
				: TSelection[Key] extends AnyColumn
				? ApplyNullabilityToColumn<TSelection[Key], TNullability[TSelection[Key]["_"]["tableName"]]>
				: TSelection[Key] extends ColumnsSelection
				? BuildSubquerySelection<TSelection[Key], TNullability>
				: never;
	  }>;

/** @internal */
export function getTableLikeName(table: AnyTable | Subquery | View | SQL): string | undefined {
	return is(table, Subquery)
		? //@ts-expect-error - TODO: fix this
		  table[SubqueryConfig].alias
		: is(table, View)
		? //@ts-expect-error - TODO: fix this
		  table[ViewBaseConfig].name
		: is(table, SQL)
		? undefined
		: //@ts-expect-error - TODO: fix this
		table[Table.Symbol.IsAlias]
		? //@ts-expect-error - TODO: fix this
		  table[Table.Symbol.Name]
		: //@ts-expect-error - TODO: fix this
		  table[Table.Symbol.BaseName];
}

export type JoinType = "inner" | "left" | "right" | "full";
