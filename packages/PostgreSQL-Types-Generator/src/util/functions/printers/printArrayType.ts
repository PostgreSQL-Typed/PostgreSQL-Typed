import type { Printer } from "../../../classes/Printer";
import type { ArrayDataType } from "../../../types/interfaces/ArrayDataType";
import type { FileContext } from "../../../types/interfaces/FileContext";

export function printArrayType(type: ArrayDataType, context: Printer, file: FileContext): string {
	return `Array<${context.getTypeScriptType(type.subtype_id, file)}>`;
}
