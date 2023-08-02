import type { Printer } from "../../../classes/Printer.js";
import { DataTypeKind } from "../../../types/enums/DataTypeKind.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";
import type { DataType } from "../../../types/types/DataType.js";
import { printArrayParser } from "../printers/printArrayParser.js";
import { printDomainParser } from "../printers/printDomainParser.js";
import { printEnumType } from "../printers/printEnumType.js";

export function getDefiner(type: DataType, context: Printer, file: FileContext): string {
	switch (type.kind) {
		case DataTypeKind.Array:
			return printArrayParser(type, context, file);
		case DataTypeKind.Domain:
			return printDomainParser(type, context, file);
		case DataTypeKind.Enum:
			return printEnumType(type, context, file);
	}

	return "unknown";
}
