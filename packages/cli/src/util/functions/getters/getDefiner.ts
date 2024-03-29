import type { Printer } from "../../../classes/Printer.js";
import { DataTypeKind } from "../../../types/enums/DataTypeKind.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";
import type { DataType } from "../../../types/types/DataType.js";
import { printArray } from "../printers/printArray.js";
import { printDomainParser } from "../printers/printDomainParser.js";
import { printEnum } from "../printers/printEnum.js";

export function getDefiner(type: DataType, context: Printer, file: FileContext): string {
	switch (type.kind) {
		case DataTypeKind.Array:
			return printArray(type, context, file);
		case DataTypeKind.Domain:
			return printDomainParser(type, context, file);
		case DataTypeKind.Enum:
			return printEnum(type, context, file);
	}

	return "unknown";
}
