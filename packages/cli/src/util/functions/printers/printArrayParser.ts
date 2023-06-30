import type { Printer } from "../../../classes/Printer.js";
import type { ArrayDataType } from "../../../types/interfaces/ArrayDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printArrayParser(type: ArrayDataType, context: Printer, file: FileContext, options: { maxLength?: number; nonNull?: boolean } = {}): string {
	return `${context.getDefiner(type.subtype_id, file, options)}.array()`;
}
