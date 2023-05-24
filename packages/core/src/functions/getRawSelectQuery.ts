import { ConstructorFromParser, Parsers, PgTPParserClass } from "@postgresql-typed/parsers";
import { getParsedType, hasKeys, isOneOf, ParsedType, type PgTError, type Safe } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import type { SelectQuery } from "../types/types/SelectQuery.js";
import { getPgTError } from "./getPgTError.js";
import { CountParser } from "./getRawJoinQuery.js";

export function getRawSelectQuery<TableColumns extends string, Select extends SelectQuery<TableColumns> = SelectQuery<TableColumns>>(
	select: Select,
	tables: Table<any, any, any, any, any>[]
): Safe<
	{
		query: string;
		mappings: Record<string, PgTPParserClass<ConstructorFromParser<Parsers>>>;
	},
	PgTError
> {
	//* Make sure the select is a string, array, or object
	const parsedType = getParsedType(select);
	if (!isOneOf([ParsedType.array, ParsedType.object, ParsedType.string], parsedType)) {
		return {
			success: false,
			error: getPgTError({
				code: "invalid_type",
				expected: [ParsedType.array, ParsedType.object, ParsedType.string],
				received: parsedType,
			}),
		};
	}

	//* Get all the columns from the tables
	const allColumns = new Set(
		tables.flatMap(joinedTable => joinedTable.columns.map(column => `${joinedTable.schema.name}.${joinedTable.name}.${column.toString()}`))
	);

	if (typeof select === "string") {
		//* If the select is a string, make sure it's a valid string
		const allowedStrings = new Set(["*", "COUNT(*)", ...allColumns]);
		if (!isOneOf<string, string>([...allowedStrings], select)) {
			return {
				success: false,
				error: getPgTError({
					code: "invalid_string",
					expected: [...allowedStrings],
					received: select,
				}),
			};
		}

		//* If the select is ALL (*), return all the columns in the mappings
		if (select === "*") {
			return {
				success: true,
				data: {
					query: select,
					mappings: Object.fromEntries([...allColumns].map(columnPath => getParserOfColumnPath(columnPath, tables))),
				},
			};
		}

		//* If the select is COUNT(*), return the count parser in the mappings
		if (select === "COUNT(*)") {
			return {
				success: true,
				data: {
					query: select,
					mappings: {
						count: CountParser,
					},
				},
			};
		}

		//* If the select is a column, return the column in the mappings
		const [columnName, parser, schemaName, tableName] = getParserOfColumnPath(select, tables);
		return {
			success: true,
			data: {
				query: `%${schemaName}.${tableName}%.${columnName}`,
				mappings: {
					[columnName]: parser,
				},
			},
		};
	}

	//* If the select is an array, make sure it's an array of valid strings
	if (Array.isArray(select)) {
		for (const column of select) {
			if (!isOneOf<string, string>([...allColumns], column)) {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_string",
						expected: [...allColumns],
						received: column,
					}),
				};
			}
		}

		//* Return the array of columns in the mappings
		return {
			success: true,
			data: {
				query: select
					.map(columnPath => {
						const [columnName, , schemaName, tableName] = getParserOfColumnPath(columnPath, tables);
						return `%${schemaName}.${tableName}%.${columnName}`;
					})
					.join(",\n"),
				mappings: Object.fromEntries(select.map(columnPath => getParserOfColumnPath(columnPath, tables))),
			},
		};
	}

	//* If the select is an object, make sure it has valid keys
	const parsedObject = hasKeys(select, [
		["*", [ParsedType.boolean, ParsedType.undefined]],
		["COUNT(*)", [ParsedType.boolean, ParsedType.object, ParsedType.undefined]],
		...[...allColumns].map((key): [string, ParsedType[]] => [key, [ParsedType.boolean, ParsedType.object, ParsedType.undefined]]),
	]);

	if (!parsedObject.success) {
		return {
			success: false,
			error: getPgTError(
				parsedObject.otherKeys.length > 0
					? {
							code: "unrecognized_keys",
							keys: parsedObject.otherKeys,
					  }
					: parsedObject.missingKeys.length > 0
					? {
							code: "missing_keys",
							keys: parsedObject.missingKeys,
					  }
					: {
							code: "invalid_key_type",
							...parsedObject.invalidKeys[0],
					  }
			),
		};
	}

	//* Make sure the select has at least one key
	if (Object.values(select).filter(Boolean).length === 0) {
		return {
			success: false,
			error: getPgTError({
				code: "too_small",
				type: "keys",
				minimum: 1,
				inclusive: true,
			}),
		};
	}

	const rows = new Set<string>(),
		mappings: Record<string, PgTPParserClass<ConstructorFromParser<Parsers>>> = {};

	//* Loop through the select object and add the columns to the rows and mappings
	for (const [key, value] of Object.entries(select).filter(([, v]) => Boolean(v)) as [
		string,
		(
			| {
					alias?: string;
					distinct?: boolean | "ON";
			  }
			| true
			| undefined
		)
	][]) {
		//* if the key is ALL (*), add all the columns to the mappings, and just add the key to the rows
		if (key === "*") {
			if (!rows.has("*")) rows.add("*");
			for (const column of allColumns) {
				const [columnName, parser] = getParserOfColumnPath(column, tables);
				mappings[columnName] = parser;
			}
			continue;
		}

		if (key === "COUNT(*)") {
			//* If the key is COUNT(*), and the value is true, add the count parser to the mappings, and just add the key to the rows
			if (typeof value === "boolean") {
				if (!rows.has("COUNT(*)")) rows.add("COUNT(*)");
				mappings.count = CountParser;
				continue;
			}

			//* If the key is COUNT(*), and the value is an object, add the count parser to the mappings, and add the key with the alias to the rows
			if (typeof value === "object") {
				const parsedObject = hasKeys(value, [["alias", [ParsedType.string]]]);

				//* If the value has invalid keys, return an error
				if (!parsedObject.success) {
					return {
						success: false,
						error: getPgTError(
							parsedObject.otherKeys.length > 0
								? {
										code: "unrecognized_keys",
										keys: parsedObject.otherKeys,
								  }
								: parsedObject.missingKeys.length > 0
								? {
										code: "missing_keys",
										keys: parsedObject.missingKeys,
								  }
								: {
										code: "invalid_key_type",
										...parsedObject.invalidKeys[0],
								  }
						),
					};
				}

				//* It should always pass this check, but just in case
				if (value.alias) {
					if (!rows.has("COUNT(*)")) rows.add(`COUNT(*) AS ${value.alias}`);
					mappings[value.alias] = CountParser;
					continue;
				}
			}
		}

		//* If the key is a column, add the column to the mappings, and add the key to the rows

		//* Fetch the parser of the column
		const [columnName, parser, schemaName, tableName] = getParserOfColumnPath(key, tables);

		//* If the value is true, add the column to the rows and mappings
		if (typeof value === "boolean") {
			if (!rows.has(columnName)) rows.add(`%${schemaName}.${tableName}%.${columnName}`);
			mappings[columnName] = parser;
			continue;
		}

		//* If the value is an object, make sure it has valid keys
		if (typeof value === "object") {
			const parsedObject = hasKeys(value, [
				["alias", [ParsedType.string, ParsedType.undefined]],
				["distinct", [ParsedType.boolean, ParsedType.string, ParsedType.undefined]],
			]);

			if (!parsedObject.success) {
				return {
					success: false,
					error: getPgTError(
						parsedObject.otherKeys.length > 0
							? {
									code: "unrecognized_keys",
									keys: parsedObject.otherKeys,
							  }
							: parsedObject.missingKeys.length > 0
							? {
									code: "missing_keys",
									keys: parsedObject.missingKeys,
							  }
							: {
									code: "invalid_key_type",
									...parsedObject.invalidKeys[0],
							  }
					),
				};
			}

			//* If the value has no keys, return an error
			const totalKeys = Object.values(value).filter(Boolean).length;
			if (totalKeys === 0) {
				return {
					success: false,
					error: getPgTError({
						code: "too_small",
						type: "keys",
						minimum: 1,
						inclusive: true,
					}),
				};
			}

			if (value.distinct) {
				//* If the value has the distinct key, and it's not a boolean, make sure it's "ON"
				if (typeof value.distinct === "string" && value.distinct !== "ON") {
					return {
						success: false,
						error: getPgTError({
							code: "invalid_string",
							expected: ["ON"],
							received: value.distinct,
						}),
					};
				}

				if (value.distinct === "ON") {
					if (!rows.has(`DISTINCT ON (%${schemaName}.${tableName}%.${columnName}) ${value.alias ?? columnName}`))
						rows.add(`DISTINCT ON (%${schemaName}.${tableName}%.${columnName}) ${value.alias ?? columnName}`);
					mappings[value.alias ?? columnName] = parser;
					continue;
				}

				if (value.alias) {
					if (!rows.has(`DISTINCT %${schemaName}.${tableName}%.${columnName} AS ${value.alias}`))
						rows.add(`DISTINCT %${schemaName}.${tableName}%.${columnName} AS ${value.alias}`);
					mappings[value.alias] = parser;
					continue;
				}

				if (!rows.has(`DISTINCT %${schemaName}.${tableName}%.${columnName}`)) rows.add(`DISTINCT %${schemaName}.${tableName}%.${columnName}`);
				mappings[columnName] = parser;
				continue;
			}

			if (value.alias) {
				if (!rows.has(`%${schemaName}.${tableName}%.${columnName} AS ${value.alias}`)) rows.add(`%${schemaName}.${tableName}%.${columnName} AS ${value.alias}`);
				mappings[value.alias] = parser;
				continue;
			}
		}
	}

	//* return the query and mappings
	return {
		success: true,
		data: {
			query: [...rows].join(",\n"),
			mappings,
		},
	};
}

function getParserOfColumnPath(
	path: string,
	tables: Table<any, any, any, any, any>[]
): [string, PgTPParserClass<ConstructorFromParser<Parsers>>, string, string] {
	const [schemaName, tableName, columnName] = path.split("."),
		table = tables.find(table => table.schema.name === schemaName && table.name === tableName);

	//* Make sure the table exists, it should always exist, but just in case
	/* c8 ignore next */
	if (!table) throw new Error("Internal error: table does not exist");

	return [columnName, table.getParserOfColumn(columnName as any) as PgTPParserClass<ConstructorFromParser<Parsers>>, schemaName, tableName];
}
