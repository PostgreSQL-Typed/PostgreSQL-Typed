import type { Printer } from "../../../classes/Printer.js";
import type { DomainDataType } from "../../../types/interfaces/DomainDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printDomainParser(type: DomainDataType, printer: Printer, file: FileContext, options: { maxLength?: number; nonNull?: boolean } = {}): string {
	return file.getImport(
		printer.context.pushTypeDeclaration({ type: "domain", name: type.type_name }, (identifierName, file) => [
			`const ${identifierName} = ${printer.getDefiner(type.base_type_id, file, options)};`,
		])
	);
}
