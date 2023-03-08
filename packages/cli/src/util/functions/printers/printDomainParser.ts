import type { Printer } from "../../../classes/Printer.js";
import type { DomainDataType } from "../../../types/interfaces/DomainDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printDomainParser(type: DomainDataType, printer: Printer, file: FileContext, maxLength?: number): string {
	return file.getImport(
		printer.context.pushTypeDeclaration({ type: "domain_data", name: type.type_name }, (identifierName, file) => [
			`const ${identifierName} = ${printer.getParserType(type.base_type_id, file, maxLength)};`,
		])
	);
}
