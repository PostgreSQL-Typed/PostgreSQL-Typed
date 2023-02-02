import type { Printer } from "../../../classes/Printer";
import type { ArrayDataType } from "../../../types/interfaces/ArrayDataType";
import type { FileContext } from "../../../types/interfaces/FileContext";

export function printArrayZod(type: ArrayDataType, context: Printer, file: FileContext): string {
	return `z.array(<${context.getZodType(type.subtype_id, file)})`;
}
