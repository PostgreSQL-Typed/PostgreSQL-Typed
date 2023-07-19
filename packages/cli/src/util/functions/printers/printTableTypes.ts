import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printTable } from "./printTable.js";

export function printTableTypes(type: ClassDetails, printer: Printer) {
	if (type.kind !== ClassKind.OrdinaryTable) throw new Error("printTableTypes only supports ordinary tables at the moment.");

	const { TableRecord, TableTypeRecord } = printTable(type, printer),
		TableInferTypeRecord = printer.context.pushTypeDeclaration(
			{
				type: "tableInferType",
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
				return [`type ${identifierName} = InferModel<typeof ${getImport(printer.config.files.preCompile ? TableTypeRecord ?? TableRecord : TableRecord)}>;`];
			}
		),
		TableInsertInferTypeRecord = printer.context.pushTypeDeclaration(
			{
				type: "tableInsertInferType",
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
				return [
					`type ${identifierName} = InferModel<typeof ${getImport(printer.config.files.preCompile ? TableTypeRecord ?? TableRecord : TableRecord)}, "insert">;`,
				];
			}
		);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "tableInferType",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		TableInferTypeRecord
	);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "tableInsertInferType",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		TableInsertInferTypeRecord
	);

	return { TableInferTypeRecord, TableInsertInferTypeRecord, TableRecord, TableTypeRecord };
}
