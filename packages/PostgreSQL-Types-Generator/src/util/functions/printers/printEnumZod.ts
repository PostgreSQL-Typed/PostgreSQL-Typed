import type { Printer } from "../../../classes/Printer";
import type { EnumDataType } from "../../../types/interfaces/EnumDataType";
import type { FileContext } from "../../../types/interfaces/FileContext";

export function printEnumZod(type: EnumDataType, printer: Printer, file: FileContext): string {
	return file.getImport(
		printer.context.pushValueDeclaration(
			{
				type: "z_enum",
				name: type.type_name,
				databaseName: type.database_name,
			},
			(identifierName, { getImport, addStringImport }) => {
				addStringImport('import { z } from "zod";');
				return [
					`const ${identifierName} = z.nativeEnum(${getImport(
						printer.context.pushValueDeclaration(
							{
								type: "enum",
								name: type.type_name,
								databaseName: type.database_name,
							},
							identifierName => [`enum ${identifierName} {`, ...type.values.map(value => `  ${value} = '${value}',`), "}"]
						)
					)});`,
				];
			}
		)
	);
}
