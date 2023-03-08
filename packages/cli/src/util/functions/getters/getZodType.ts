import type { Printer } from "../../../classes/Printer.js";
import { DataTypeKind } from "../../../types/enums/DataTypeKind.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";
import type { DataType } from "../../../types/types/DataType.js";
import { printArrayZod } from "../printers/printArrayZod.js";
import { printDomainZod } from "../printers/printDomainZod.js";
import { printEnumZod } from "../printers/printEnumZod.js";

export function getZodType(type: DataType, context: Printer, file: FileContext): string {
	switch (type.kind) {
		case DataTypeKind.Array:
			return printArrayZod(type, context, file);
		case DataTypeKind.Domain:
			return printDomainZod(type, context, file);
		case DataTypeKind.Enum:
			return printEnumZod(type, context, file);
	}

	return "z.string()";
}
