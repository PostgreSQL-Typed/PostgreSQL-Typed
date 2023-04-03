import type { ConstructorFromParser, Parsers, PGTPParserClass } from "@postgresql-typed/parsers";

import type { PostgresData } from "../interfaces/PostgresData.js";
import type { ColumnsOfTable } from "./ColumnsOfTable.js";
import type { TableLocations } from "./TableLocations.js";

export type ParserOfColumn<
	InnerPostgresData extends PostgresData,
	Location extends TableLocations<InnerPostgresData>,
	Column extends ColumnsOfTable<InnerPostgresData, Location>
> = Location extends `${infer DatabaseName}.${infer SchemaName}.${infer TableName}`
	? NonNullable<InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"][TableName]["columns"][Column]> extends Parsers
		? PGTPParserClass<ConstructorFromParser<NonNullable<InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"][TableName]["columns"][Column]>>>
		: never
	: never;
