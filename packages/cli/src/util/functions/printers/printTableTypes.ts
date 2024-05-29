import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printTable } from "./printTable.js";

export function printTableTypes(type: ClassDetails, printer: Printer) {
	const { TableRecord, TableTypeRecord } = printTable(type, printer),
		TableInferTypeRecord = printer.context.pushTypeDeclaration(
			{
				databaseName: type.database_name,
				name: type.class_name,
				schemaName: type.schema_name,
				type: "tableInferType",
			},
			(identifierName, { addImportStatement, getImport }) => {
				if (type.kind === ClassKind.OrdinaryTable) {
					return [
						`type ${identifierName} = typeof ${getImport(printer.config.files.preCompile ? TableTypeRecord ?? TableRecord : TableRecord)}._.inferSelect;`,
					];
				}

				addImportStatement({
					isType: true,
					module: "@postgresql-typed/core",
					name: "InferView",
					type: "named",
				});
				return [`type ${identifierName} = InferView<typeof ${getImport(printer.config.files.preCompile ? TableTypeRecord ?? TableRecord : TableRecord)}>;`];
			}
		),
		TableInsertInferTypeRecord =
			type.kind === ClassKind.OrdinaryTable
				? printer.context.pushTypeDeclaration(
						{
							databaseName: type.database_name,
							name: type.class_name,
							schemaName: type.schema_name,
							type: "tableInsertInferType",
						},
						(identifierName, { getImport }) => {
							return [
								`type ${identifierName} = typeof ${getImport(printer.config.files.preCompile ? TableTypeRecord ?? TableRecord : TableRecord)}._.inferInsert;`,
							];
						}
				  )
				: undefined;

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

	if (TableInsertInferTypeRecord) {
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
	}

	return { TableInferTypeRecord, TableInsertInferTypeRecord, TableRecord, TableTypeRecord };
}
