import type { Printer } from "../../../classes/Printer.js";
import type { EnumDataType } from "../../../types/interfaces/EnumDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printEnumType(type: EnumDataType, printer: Printer, file: FileContext): string {
	return file.getImport(
		printer.context.pushValueDeclaration({ type: "enum", name: type.type_name, databaseName: type.database_name }, identifierName => [
			`enum ${identifierName} {`,
			...type.values.map(value => `  ${value} = '${value}',`),
			"}",
		])
	);
}
