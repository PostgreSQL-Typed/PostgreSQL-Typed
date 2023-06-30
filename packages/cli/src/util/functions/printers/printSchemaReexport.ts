import type { Printer } from "../../../classes/Printer.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printTableTypes } from "./printTableTypes.js";

export function printSchemaReexport(types: ClassDetails[], printer: Printer) {
	const SchemaReexportRecord = printer.context.pushTypeDeclaration(
		{
			type: "schemaReexport",
			name: types[0].schema_name,
			databaseName: types[0].database_name,
		},
		(_, { getRelativePath }) => [
			types
				.flatMap(type => {
					const { TableInsertTypeRecord, TableTypeRecord } = printTableTypes(type, printer),
						exports = [`export * from "${getRelativePath(TableInsertTypeRecord)}";`, `export * from "${getRelativePath(TableTypeRecord)}";`];
					return TableInsertTypeRecord.file === TableTypeRecord.file ? [exports[0]] : exports;
				})
				.join("\n"),
		]
	);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "schemaReexport",
				name: types[0].schema_name,
				databaseName: types[0].database_name,
			},
		},
		SchemaReexportRecord
	);

	return { SchemaReexportRecord };
}
