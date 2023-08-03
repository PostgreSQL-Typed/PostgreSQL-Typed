import type { Printer } from "../../../classes/Printer.js";
import { DataTypeKind } from "../../../types/enums/DataTypeKind.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";
import type { DataType } from "../../../types/types/DataType.js";
import { printArrayType } from "../printers/printArrayType.js";
import { printDomainParser } from "../printers/printDomainParser.js";
import { printEnumType } from "../printers/printEnumType.js";

export function getDefinerType(type: DataType, context: Printer, file: FileContext): string {
	switch (type.kind) {
		case DataTypeKind.Array:
			return printArrayType(type, context, file);
		case DataTypeKind.Domain:
			return printDomainParser(type, context, file);
		case DataTypeKind.Enum:
			return printEnumType(type, context, file);
	}

	return "unknown";
}
