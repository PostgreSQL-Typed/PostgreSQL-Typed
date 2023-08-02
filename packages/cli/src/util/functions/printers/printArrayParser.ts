import type { Printer } from "../../../classes/Printer.js";
import type { ArrayDataType } from "../../../types/interfaces/ArrayDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printArrayParser(type: ArrayDataType, context: Printer, file: FileContext): string {
	return `${context.getDefiner(type.subtype_id, file, {
		schemaName: type.schema_name,
		tableName: type.type_name,
		columnName: type.subtype_name,
	})}.array()`;
}
