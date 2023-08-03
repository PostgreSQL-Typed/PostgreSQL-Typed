import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printTable } from "./printTable.js";

export function printTableTypes(type: ClassDetails, printer: Printer) {
	if (type.kind !== ClassKind.OrdinaryTable) throw new Error("printTableTypes only supports ordinary tables at the moment.");

	const { TableRecord, TableTypeRecord } = printTable(type, printer),
		TableInferTypeRecord = printer.context.pushTypeDeclaration(
			{
				databaseName: type.database_name,
				name: type.class_name,
				schemaName: type.schema_name,
				type: "tableInferType",
			},
			(identifierName, { addImportStatement, getImport }) => {
				addImportStatement({
					isType: true,
					module: "@postgresql-typed/core",
					name: "InferModel",
					type: "named",
				});
				return [`type ${identifierName} = InferModel<typeof ${getImport(printer.config.files.preCompile ? TableTypeRecord ?? TableRecord : TableRecord)}>;`];
			}
		),
		TableInsertInferTypeRecord = printer.context.pushTypeDeclaration(
			{
				databaseName: type.database_name,
				name: type.class_name,
				schemaName: type.schema_name,
				type: "tableInsertInferType",
			},
			(identifierName, { addImportStatement, getImport }) => {
				addImportStatement({
					isType: true,
					module: "@postgresql-typed/core",
					name: "InferModel",
					type: "named",
				});
				return [
					`type ${identifierName} = InferModel<typeof ${getImport(printer.config.files.preCompile ? TableTypeRecord ?? TableRecord : TableRecord)}, "insert">;`,
				];
			}
		);

	printer.context.pushReExport(
		{
			of: {
				databaseName: type.database_name,
				name: type.class_name,
				schemaName: type.schema_name,
				type: "tableInferType",
			},
			type: "export",
		},
		TableInferTypeRecord
	);

	printer.context.pushReExport(
		{
			of: {
				databaseName: type.database_name,
				name: type.class_name,
				schemaName: type.schema_name,
				type: "tableInsertInferType",
			},
			type: "export",
		},
		TableInsertInferTypeRecord
	);

	return { TableInferTypeRecord, TableInsertInferTypeRecord, TableRecord, TableTypeRecord };
}
