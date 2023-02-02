import type { Printer } from "../../../classes/Printer";
import type { DomainDataType } from "../../../types/interfaces/DomainDataType";
import type { FileContext } from "../../../types/interfaces/FileContext";

export function printDomainType(type: DomainDataType, printer: Printer, file: FileContext): string {
	return file.getImport(
		printer.context.pushTypeDeclaration({ type: "domain", name: type.type_name }, (identifierName, file) => [
			`type ${identifierName} = ${printer.getTypeScriptType(type.base_type_id, file)};`,
		])
	);
}
