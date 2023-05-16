/* eslint-disable unicorn/filename-case */
import type { ConstructorFromParser, Parsers, PGTPParserClass } from "@postgresql-typed/parsers";
import type { PostgresData } from "@postgresql-typed/util";

import type { ColumnsOfTable } from "./ColumnsOfTable.js";
import type { TableLocations } from "./TableLocations.js";

export type PGTPParserOfColumn<
	InnerPostgresData extends PostgresData,
	Location extends TableLocations<InnerPostgresData>,
	Column extends ColumnsOfTable<InnerPostgresData, Location>
> = Location extends `${infer DatabaseName}.${infer SchemaName}.${infer TableName}`
	? NonNullable<InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"][TableName]["columns"][Column]> extends Parsers
		? PGTPParserClass<
				NonNullable<ConstructorFromParser<NonNullable<InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"][TableName]["columns"][Column]>>>
		  >
		: never
	: never;
