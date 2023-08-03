import type { Printer } from "../../../classes/Printer.js";
import type { DomainDataType } from "../../../types/interfaces/DomainDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printDomainParser(type: DomainDataType, printer: Printer, file: FileContext): string {
	return file.getImport(
		printer.context.pushTypeDeclaration({ name: type.type_name, type: "domain" }, (identifierName, file) => [
			`const ${identifierName} = ${printer.getDefiner(type.base_type_id, file, {
				columnName: type.base_type_name,
				schemaName: type.schema_name,
				tableName: type.type_name,
			})};`,
		])
	);
}
