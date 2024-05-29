import type { Printer } from "../../../classes/Printer.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printTableTypes } from "./printTableTypes.js";

export function printSchemaReexport(types: ClassDetails[], printer: Printer) {
	const SchemaReexportRecord = printer.context.pushTypeDeclaration(
		{
			databaseName: types[0].database_name,
			name: types[0].schema_name,
			type: "schemaReexport",
		},
		(_, { getRelativePath }) => [
			types
				.flatMap(type => {
					const { TableInsertInferTypeRecord, TableInferTypeRecord, TableRecord } = printTableTypes(type, printer),
						exports = [
							TableInsertInferTypeRecord ? `export * from "${getRelativePath(TableInsertInferTypeRecord)}";` : undefined,
							`export * from "${getRelativePath(TableInferTypeRecord)}";`,
							`export * from "${getRelativePath(TableRecord)}";`,
						]
							.filter((v): v is string => v !== undefined)
							//* remove duplicates
							.filter((v, index, a) => a.indexOf(v) === index);
					return exports;
				})
				.join("\n"),
		]
	);

	printer.context.pushReExport(
		{
			of: {
				databaseName: types[0].database_name,
				name: types[0].schema_name,
				type: "schemaReexport",
			},
			type: "export",
		},
		SchemaReexportRecord
	);

	if (!printer.config.files.preCompile) return { SchemaReexportRecord };

	const SchemaTypeReexportRecord = printer.context.pushTypeDeclaration(
		{
			databaseName: types[0].database_name,
			name: types[0].schema_name,
			type: "schemaTypeReexport",
		},
		(_, { getRelativePath }) => [
			types
				.flatMap(type => {
					const { TableInsertInferTypeRecord, TableInferTypeRecord, TableRecord } = printTableTypes(type, printer),
						exports = [
							TableInsertInferTypeRecord ? `export * from "${getRelativePath(TableInsertInferTypeRecord)}";` : undefined,
							`export * from "${getRelativePath(TableInferTypeRecord)}";`,
							`export * from "${getRelativePath(TableRecord)}";`,
						]
							.filter((v): v is string => v !== undefined)
							//* remove duplicates
							.filter((v, index, a) => a.indexOf(v) === index);
					return exports;
				})
				.join("\n"),
		]
	);

	printer.context.pushReExport(
		{
			of: {
				databaseName: types[0].database_name,
				name: types[0].schema_name,
				type: "schemaTypeReexport",
			},
			type: "export",
		},
		SchemaTypeReexportRecord
	);

	return { SchemaReexportRecord, SchemaTypeReexportRecord };
}
