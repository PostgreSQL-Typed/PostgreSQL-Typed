import { ConstructorFromParser, Parsers, PGTPParserClass } from "@postgresql-typed/parsers";
import { getParsedType, hasKeys, isOneOf, ParsedType } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import type { Safe } from "../types/types/Safe.js";
import type { SelectQuery } from "../types/types/SelectQuery.js";
import type { PGTError } from "../util/PGTError.js";
import { getPGTError } from "./getPGTError.js";
import { CountParser } from "./getRawJoinQuery.js";

export function getRawSelectQuery<TableColumns extends string, Select extends SelectQuery<TableColumns> = SelectQuery<TableColumns>>(
	select: Select,
	tables: Table<any, any, any, any, any>[]
): Safe<
	{
		query: string;
		mappings: Record<string, PGTPParserClass<ConstructorFromParser<Parsers>>>;
	},
	PGTError
> {
	const parsedType = getParsedType(select);
	if (!isOneOf([ParsedType.array, ParsedType.object, ParsedType.string], parsedType)) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_type",
				expected: [ParsedType.array, ParsedType.object, ParsedType.string],
				received: parsedType,
			}),
		};
	}

	const allColumns = new Set(
		tables.flatMap(joinedTable => joinedTable.columns.map(column => `${joinedTable.schema.name}.${joinedTable.name}.${column.toString()}`))
	);

	if (typeof select === "string") {
		const allowedStrings = new Set(["*", "COUNT(*)", ...allColumns]);

		if (!isOneOf<string, string>([...allowedStrings], select)) {
			return {
				success: false,
				error: getPGTError({
					code: "invalid_string",
					expected: [...allowedStrings],
					received: select,
				}),
			};
		}

		if (select === "*") {
			return {
				success: true,
				data: {
					query: select,
					mappings: Object.fromEntries([...allColumns].map(columnPath => getParserOfColumnPath(columnPath, tables))),
				},
			};
		}

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
	if (Array.isArray(select)) {
		for (const column of select) {
			if (!isOneOf<string, string>([...allColumns], column)) {
				return {
					success: false,
					error: getPGTError({
						code: "invalid_string",
						expected: [...allColumns],
						received: column,
					}),
				};
			}
		}

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

	const parsedObject = hasKeys(select, [
		["*", [ParsedType.boolean, ParsedType.undefined]],
		["COUNT(*)", [ParsedType.boolean, ParsedType.object, ParsedType.undefined]],
		...[...allColumns].map((key): [string, ParsedType[]] => [key, [ParsedType.boolean, ParsedType.object, ParsedType.undefined]]),
	]);

	if (!parsedObject.success) {
		return {
			success: false,
			error: getPGTError(
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

	if (Object.values(select).filter(Boolean).length === 0) {
		return {
			success: false,
			error: getPGTError({
				code: "too_small",
				type: "keys",
				minimum: 1,
				inclusive: true,
			}),
		};
	}

	const rows = new Set<string>(),
		mappings: Record<string, PGTPParserClass<ConstructorFromParser<Parsers>>> = {};
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
		if (key === "*") {
			if (!rows.has("*")) rows.add("*");
			for (const column of allColumns) {
				const [columnName, parser] = getParserOfColumnPath(column, tables);
				mappings[columnName] = parser;
			}
			continue;
		}

		if (key === "COUNT(*)") {
			if (typeof value === "boolean") {
				if (!rows.has("COUNT(*)")) rows.add("COUNT(*)");
				mappings.count = CountParser;
				continue;
			}

			if (typeof value === "object") {
				const parsedObject = hasKeys(value, [["alias", [ParsedType.string]]]);

				if (!parsedObject.success) {
					return {
						success: false,
						error: getPGTError(
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

				if (value.alias) {
					if (!rows.has("COUNT(*)")) rows.add(`COUNT(*) AS ${value.alias}`);
					mappings[value.alias] = CountParser;
					continue;
				}
			}
		}

		const [columnName, parser, schemaName, tableName] = getParserOfColumnPath(key, tables);

		if (typeof value === "boolean") {
			if (!rows.has(columnName)) rows.add(`%${schemaName}.${tableName}%.${columnName}`);
			mappings[columnName] = parser;
			continue;
		}

		if (typeof value === "object") {
			const parsedObject = hasKeys(value, [
				["alias", [ParsedType.string, ParsedType.undefined]],
				["distinct", [ParsedType.boolean, ParsedType.string, ParsedType.undefined]],
			]);

			if (!parsedObject.success) {
				return {
					success: false,
					error: getPGTError(
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

			const totalKeys = Object.values(value).filter(Boolean).length;
			if (totalKeys === 0) {
				return {
					success: false,
					error: getPGTError({
						code: "too_small",
						type: "keys",
						minimum: 1,
						inclusive: true,
					}),
				};
			}

			if (value.distinct) {
				if (typeof value.distinct === "string" && value.distinct !== "ON") {
					return {
						success: false,
						error: getPGTError({
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
): [string, PGTPParserClass<ConstructorFromParser<Parsers>>, string, string] {
	const [schemaName, tableName, columnName] = path.split("."),
		table = tables.find(table => table.schema.name === schemaName && table.name === tableName);

	//* Make sure the table exists
	/* c8 ignore next */
	if (!table) throw new Error("Internal error: table does not exist");

	return [columnName, table.getParserOfColumn(columnName as any) as PGTPParserClass<ConstructorFromParser<Parsers>>, schemaName, tableName];
}
