import { type DatabaseData, getParsedType, hasKeys, isOneOf, ParsedType, type PGTError, type PostgresData, type Safe } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import type { OrderBy as OrderByQuery } from "../types/types/OrderBy.js";
import { getPGTError } from "./getPGTError.js";

export function getRawOrderBy<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	OrderBy extends OrderByQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables> = OrderByQuery<
		InnerPostgresData,
		InnerDatabaseData,
		Ready,
		JoinedTables
	>
>(orderBy: OrderBy, tables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[]): Safe<string, PGTError> {
	//* Make sure the orderBy is an object
	const parsedType = getParsedType(orderBy);
	if (parsedType !== ParsedType.object) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_type",
				expected: ParsedType.object,
				received: parsedType,
			}),
		};
	}

	//* Make sure the orderBy has the correct keys
	const parsedObject = hasKeys<OrderBy>(orderBy, [
		["nulls", [ParsedType.string, ParsedType.undefined]],
		["columns", [ParsedType.object, ParsedType.undefined]],
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

	const { columns, nulls } = parsedObject.obj;

	//* Make sure the orderBy has at least one column
	if (!columns && !nulls) {
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

	//* Make sure the nulls value is valid if it exists
	if (nulls && !isOneOf(["NULLS FIRST", "NULLS LAST"], nulls)) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_string",
				expected: ["NULLS FIRST", "NULLS LAST"],
				received: nulls,
			}),
		};
	}

	let validColumns: [string, string][] = [];
	if (columns) {
		//* Make sure the columns is a valid object
		const availableColumns = tables.flatMap(table => table.columns.map(column => `${table.schema.name}.${table.name}.${column.toString()}`)),
			parsedColumns = hasKeys<Record<string, string>>(
				columns,
				availableColumns.map(column => [column, [ParsedType.string, ParsedType.undefined]])
			);

		if (!parsedColumns.success) {
			return {
				success: false,
				error: getPGTError(
					parsedColumns.otherKeys.length > 0
						? {
								code: "unrecognized_keys",
								keys: parsedColumns.otherKeys,
						  }
						: parsedColumns.missingKeys.length > 0
						? {
								code: "missing_keys",
								keys: parsedColumns.missingKeys,
						  }
						: {
								code: "invalid_key_type",
								...parsedColumns.invalidKeys[0],
						  }
				),
			};
		}

		//* Check if there is at least one valid column
		if (!Object.values(parsedColumns.obj).some(Boolean)) {
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

		const filteredColumns = Object.entries(parsedColumns.obj).filter(([, value]) => value);

		//* Make sure the directions are valid
		for (const [, direction] of filteredColumns) {
			if (!isOneOf(["ASC", "DESC"], direction)) {
				return {
					success: false,
					error: getPGTError({
						code: "invalid_string",
						expected: ["ASC", "DESC"],
						received: direction,
					}),
				};
			}
		}

		//* Map the columns to the correct format
		validColumns = filteredColumns.map(([column, direction]) => {
			//* %schema.table%.column
			const strings = column.split(".") as [string, string, string],
				tableLocation = `%${strings[0]}.${strings[1]}%.${strings[2]}`;

			return [tableLocation, direction];
		});
	}

	//* Return the raw ORDER BY
	return {
		success: true,
		data: `ORDER BY${validColumns.length > 0 ? ` ${validColumns.map(([column, direction]) => `${column} ${direction}`).join(", ")}` : ""}${
			nulls ? ` ${nulls}` : ""
		}`,
	};
}
