import type { Printer } from "../../../classes/Printer.js";
import { DataTypeKind } from "../../../types/enums/DataTypeKind.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";
import type { DataType } from "../../../types/types/DataType.js";
import { printArrayType } from "../printers/printArrayType.js";
import { printDomainType } from "../printers/printDomainType.js";
import { printEnumType } from "../printers/printEnumType.js";

export function getTypeScriptType(type: DataType, context: Printer, file: FileContext): string {
	switch (type.kind) {
		case DataTypeKind.Array:
			return printArrayType(type, context, file);
		case DataTypeKind.Domain:
			return printDomainType(type, context, file);
		case DataTypeKind.Enum:
			return printEnumType(type, context, file);
	}

	return "string";
}
