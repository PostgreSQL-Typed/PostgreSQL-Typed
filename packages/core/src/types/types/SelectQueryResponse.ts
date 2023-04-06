import type { ConstructorFromParser, Int4, Parsers, ValueFromConstructor } from "@postgresql-typed/parsers";

import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { ColumnFromPath } from "./ColumnFromPath.js";
import type { ParserFromColumn } from "./ParserFromColumn.js";
import type { SelectQuery, SelectQueryObject } from "./SelectQuery.js";
import type { InnerObjectsToUnion, MergeUnionOfObjects } from "./UnionObjects.js";

type Count = Int4;

export type SelectQueryResponse<
	InnerDatabaseData extends DatabaseData,
	Columns extends string,
	Select extends SelectQuery<string>,
	ValuesOnly extends boolean,
	Inner extends SelectQueryResponseInner<InnerDatabaseData, Columns, Select> = SelectQueryResponseInner<InnerDatabaseData, Columns, Select>
> = {
	[Key in keyof Inner]: ValuesOnly extends true
		? Inner[Key] extends Parsers | null
			? ValueFromConstructor<ConstructorFromParser<Inner[Key]>>
			: never
		: Inner[Key];
};

type SelectQueryResponseInner<InnerDatabaseData extends DatabaseData, Columns extends string, Select extends SelectQuery<string>> = Select extends "*"
	? {
			[Column in ColumnFromPath<Columns>]: ParserFromColumn<Columns, Column, InnerDatabaseData>;
	  }
	: Select extends "COUNT(*)"
	? {
			count: Count;
	  }
	: //* if its an array of Columns
	Select extends readonly [...infer ColumnsFromArray]
	? {
			[Column in ColumnFromPath<ColumnsFromArray[number] extends string ? ColumnsFromArray[number] : never>]: ParserFromColumn<
				ColumnsFromArray[number] extends string ? ColumnsFromArray[number] : never,
				Column,
				InnerDatabaseData
			>;
	  }
	: //* if its a string
	Select extends string
	? {
			[Column in ColumnFromPath<Select>]: ParserFromColumn<Select, Column, InnerDatabaseData>;
	  }
	: //* if its an object
	Select extends SelectQueryObject<Columns>
	? MergeUnionOfObjects<InnerObjectsToUnion<SelectQueryResponseObject<Columns, Select, InnerDatabaseData>>>
	: never;

type SelectQueryResponseObject<Columns extends string, Select extends SelectQueryObject<Columns>, InnerDatabaseData extends DatabaseData> = {
	[Key in keyof Select]: Key extends "*"
		? Select[Key] extends true
			? {
					[Column in ColumnFromPath<Columns>]: ParserFromColumn<Columns, Column, InnerDatabaseData>;
			  }
			: never
		: Key extends "COUNT(*)"
		? Select[Key] extends object
			? Select[Key]["alias"] extends string
				? { [Alias in Select[Key]["alias"]]: Count }
				: never
			: Select[Key] extends true
			? { count: Count }
			: never
		: Key extends string
		? Select[Key] extends object
			? Select[Key]["alias"] extends string
				? { [Alias in Select[Key]["alias"]]: ParserFromColumn<Columns, ColumnFromPath<Key>, InnerDatabaseData> }
				: { [Column in ColumnFromPath<Key>]: ParserFromColumn<Columns, Column, InnerDatabaseData> }
			: Select[Key] extends true
			? { [Column in ColumnFromPath<Key>]: ParserFromColumn<Columns, Column, InnerDatabaseData> }
			: never
		: never;
};
