import type { Printer } from "../../../classes/Printer.js";
import type { ArrayDataType } from "../../../types/interfaces/ArrayDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printArrayType(type: ArrayDataType, context: Printer, file: FileContext): string {
	file.addImportStatement({
		isType: true,
		module: "@postgresql-typed/core/definers",
		name: "PgTArrayOfType",
		type: "named",
	});
	return `PgTArrayOfType<${context.getDefinerType(type.subtype_id, file, {
		columnName: type.subtype_name,
		schemaName: type.schema_name,
		tableName: type.type_name,
	})}>`;
}
