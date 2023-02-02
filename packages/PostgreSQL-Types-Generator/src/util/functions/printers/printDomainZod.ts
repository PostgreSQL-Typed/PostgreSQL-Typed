import type { Printer } from "../../../classes/Printer";
import type { DomainDataType } from "../../../types/interfaces/DomainDataType";
import type { FileContext } from "../../../types/interfaces/FileContext";

export function printDomainZod(type: DomainDataType, printer: Printer, file: FileContext): string {
	return file.getImport(
		printer.context.pushTypeDeclaration({ type: "z_domain", name: type.type_name }, (identifierName, file) => [
			`const ${identifierName} = ${printer.getZodType(type.base_type_id, file)};`,
		])
	);
}
