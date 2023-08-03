import type { Printer } from "../../../classes/Printer.js";
import type { EnumDataType } from "../../../types/interfaces/EnumDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printEnumType(type: EnumDataType, printer: Printer, file: FileContext): string {
	file.addImportStatement({
		isType: true,
		module: "@postgresql-typed/core/definers",
		name: "PgTEnumType",
		type: "named",
	});
	if (printer.config.files.definerModes.enum === "Enum") {
		file.addImportStatement({
			isType: true,
			module: "@postgresql-typed/parsers",
			name: "Enum",
			type: "named",
		});
	}
	printer.context.pushTypeDeclaration({ databaseName: type.database_name, name: type.type_name, type: "enumType" }, identifierName => [
		`declare const ${identifierName} = {`,
		...type.values.map(value => `  ${value}: "${value}",`),
		"} as const;",
	]);

	const enumType = printer.config.files.definerModes.enum === "Enum" ? `Enum<string, ["${type.values.join('", "')}"]>` : `"${type.values.join('" | "')}"`;

	return `PgTEnumType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, ${enumType}>`;
}
