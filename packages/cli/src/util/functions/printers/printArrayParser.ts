import type { Printer } from "../../../classes/Printer.js";
import type { ArrayDataType } from "../../../types/interfaces/ArrayDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printArrayParser(type: ArrayDataType, context: Printer, file: FileContext, maxLength?: number): string {
	return `z.array(<${context.getParserType(type.subtype_id, file, maxLength)})`;
}
