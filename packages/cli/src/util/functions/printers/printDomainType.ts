import type { Printer } from "../../../classes/Printer.js";
import type { DomainDataType } from "../../../types/interfaces/DomainDataType.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printDomainType(type: DomainDataType, printer: Printer, file: FileContext, maxLength?: number): string {
	return file.getImport(
		printer.context.pushTypeDeclaration({ type: "domain_type", name: type.type_name }, (identifierName, file) => [
			`type ${identifierName} = ${printer.getTypeScriptType(type.base_type_id, file, maxLength)};`,
		])
	);
}