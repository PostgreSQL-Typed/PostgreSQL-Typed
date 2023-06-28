import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printTable } from "./printTable.js";

export function printTableTypes(type: ClassDetails, printer: Printer) {
	if (type.kind !== ClassKind.OrdinaryTable) throw new Error("printTableTypes only supports ordinary tables at the moment.");

	const { TableRecord } = printTable(type, printer),
		TableTypeRecord = printer.context.pushTypeDeclaration(
			{
				type: "tableType",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
			(identifierName, { addImportStatement, getImport }) => {
				addImportStatement({
					module: "@postgresql-typed/core",
					name: "InferModel",
					type: "named",
					isType: true,
				});
				return [`type ${identifierName} = InferModel<typeof ${getImport(TableRecord)}>;`];
			}
		),
		TableInsertTypeRecord = printer.context.pushTypeDeclaration(
			{
				type: "tableInsertType",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
			(identifierName, { addImportStatement, getImport }) => {
				addImportStatement({
					module: "@postgresql-typed/core",
					name: "InferModel",
					type: "named",
					isType: true,
				});
				return [`type ${identifierName} = InferModel<typeof ${getImport(TableRecord)}, "insert">;`];
			}
		);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "tableType",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		TableTypeRecord
	);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "tableInsertType",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		TableInsertTypeRecord
	);

	return { TableTypeRecord, TableInsertTypeRecord };
}
