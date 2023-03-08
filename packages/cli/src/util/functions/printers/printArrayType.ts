import type { Printer } from "../../../classes/Printer.js";
import type { ArrayDataType } from "../../../types/interfaces/ArrayDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printArrayType(type: ArrayDataType, context: Printer, file: FileContext): string {
	return `Array<${context.getTypeScriptType(type.subtype_id, file)}>`;
}
