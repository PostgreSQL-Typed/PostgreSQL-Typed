import type { Printer } from "../../../classes/Printer";
import type { EnumDataType } from "../../../types/interfaces/EnumDataType";
import type { FileContext } from "../../../types/interfaces/FileContext";

export function printEnumType(type: EnumDataType, printer: Printer, file: FileContext): string {
	return file.getImport(
		printer.context.pushValueDeclaration({ type: "enum", name: type.type_name, databaseName: type.database_name }, identifierName => [
			`enum ${identifierName} {`,
			...type.values.map(value => `  ${value} = '${value}',`),
			"}",
		])
	);
}
