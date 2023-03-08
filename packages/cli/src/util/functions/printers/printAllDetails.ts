import type { Printer } from "../../../classes/Printer.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printDatabaseDetails } from "./printDatabaseDetails.js";

export function printAllDetails(databaseClassLists: ClassDetails[][], printer: Printer) {
	const DatabasesTypeRecord = printer.context.pushTypeDeclaration(
		{
			type: "full_export_type",
		},
		(identifier, { getImport }) => [
			`type ${identifier} = {`,
			...databaseClassLists.map(databaseClasses => {
				const { DatabaseTypeRecord } = printDatabaseDetails(databaseClasses, printer);
				return `  "${databaseClasses[0].database_name}": ${getImport(DatabaseTypeRecord)}`;
			}),
			"}",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "full_export_type",
			},
		},
		DatabasesTypeRecord
	);

	const DatabasesValueRecord = printer.context.pushValueDeclaration(
		{
			type: "full_export_data",
		},
		(identifier, { getImport }) => [
			`const ${identifier} = {`,
			...databaseClassLists.map(databaseClasses => {
				const { DatabaseValueRecord } = printDatabaseDetails(databaseClasses, printer);
				return `  "${databaseClasses[0].database_name}": ${getImport(DatabaseValueRecord)}`;
			}),
			"}",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "full_export_data",
			},
		},
		DatabasesValueRecord
	);

	return { DatabasesTypeRecord, DatabasesValueRecord };
}
