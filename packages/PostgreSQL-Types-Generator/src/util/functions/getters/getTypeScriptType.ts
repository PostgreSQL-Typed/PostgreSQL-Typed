import type { Printer } from "../../../classes/Printer";
import { DataTypeKind } from "../../../types/enums/DataTypeKind";
import type { FileContext } from "../../../types/interfaces/FileContext";
import type { DataType } from "../../../types/types/DataType";
import { printArrayType } from "../printers/printArrayType";
import { printDomainType } from "../printers/printDomainType";
import { printEnumType } from "../printers/printEnumType";

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
