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
					const { TableInsertInferTypeRecord, TableInferTypeRecord, TableRecord } = printTableTypes(type, printer),
						exports = [
							`export * from "${getRelativePath(TableInsertInferTypeRecord)}";`,
							`export * from "${getRelativePath(TableInferTypeRecord)}";`,
							`export * from "${getRelativePath(TableRecord)}";`,
						]
							//* remove duplicates
							.filter((v, index, a) => a.indexOf(v) === index);
					return exports;
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

	if (!printer.config.files.preCompile) return { SchemaReexportRecord };

	const SchemaTypeReexportRecord = printer.context.pushTypeDeclaration(
		{
			type: "schemaTypeReexport",
			name: types[0].schema_name,
			databaseName: types[0].database_name,
		},
		(_, { getRelativePath }) => [
			types
				.flatMap(type => {
					const { TableInsertInferTypeRecord, TableInferTypeRecord, TableRecord } = printTableTypes(type, printer),
						exports = [
							`export * from "${getRelativePath(TableInsertInferTypeRecord)}";`,
							`export * from "${getRelativePath(TableInferTypeRecord)}";`,
							`export * from "${getRelativePath(TableRecord)}";`,
						]
							//* remove duplicates
							.filter((v, index, a) => a.indexOf(v) === index);
					return exports;
				})
				.join("\n"),
		]
	);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "schemaTypeReexport",
				name: types[0].schema_name,
				databaseName: types[0].database_name,
			},
		},
		SchemaTypeReexportRecord
	);

	return { SchemaReexportRecord, SchemaTypeReexportRecord };
}
