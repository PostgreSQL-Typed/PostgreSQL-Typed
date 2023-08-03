import type { Printer } from "../../../classes/Printer.js";
import type { EnumDataType } from "../../../types/interfaces/EnumDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printEnum(type: EnumDataType, printer: Printer, file: FileContext): string {
	file.addImportStatement({
		module: "@postgresql-typed/core/definers",
		name: "defineEnum",
		type: "named",
	});
	return `defineEnum("%ATTRIBUTE%", { mode: "%MODE%", enumName: "${type.type_name}", enumValues: Object.keys(${file.getImport(
		printer.context.pushValueDeclaration({ databaseName: type.database_name, name: type.type_name, type: "enum" }, identifierName => [
			`const ${identifierName} = {`,
			...type.values.map(value => `  ${value}: "${value}",`),
			"};",
		])
	)}), })%NOTNULL%`;
}
