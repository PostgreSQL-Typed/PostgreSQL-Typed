import type { Printer } from "../../../classes/Printer";
import { ClassKind } from "../../../types/enums/ClassKind";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails";
import { printClassDetails } from "../../functions/printers/printClassDetails";

export function printSchemaDetails(types: ClassDetails[], printer: Printer) {
	if (types.some(type => type.kind !== ClassKind.OrdinaryTable)) throw new Error("printSchemaDetails only supports ordinary tables at the moment.");

	const SchemaTypeRecord = printer.context.pushTypeDeclaration(
		{
			type: "schema_type",
			name: types[0].schema_name,
			databaseName: types[0].database_name,
		},
		(identifier, { getImport }) => [
			`interface ${identifier} {`,
			`  name: "${types[0].schema_name}";`,
			"  tables: {",
			...types
				.filter(cls => cls.kind === ClassKind.OrdinaryTable)
				.map(cls => {
					const { DatabaseRecord, InsertParameters, PrimaryKey } = printClassDetails(cls, printer);
					return `    ${cls.class_name}: {\n      name: "${cls.class_name}";\n      primary_key: typeof ${getImport(PrimaryKey)};\n      columns: ${getImport(
						DatabaseRecord
					)};\n      insert_parameters: ${getImport(InsertParameters)};\n    };`;
				}),
			"  };",
			"};",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "schema_type",
				name: types[0].schema_name,
				databaseName: types[0].database_name,
			},
		},
		SchemaTypeRecord
	);

	const SchemaValueRecord = printer.context.pushValueDeclaration(
		{
			type: "schema_data",
			name: types[0].schema_name,
			databaseName: types[0].database_name,
		},
		(identifier, { getImport }) => [
			`const ${identifier} = {`,
			`  name: "${types[0].schema_name}" as "${types[0].schema_name}",`,
			"  tables: [",
			types
				.filter(cls => cls.kind === ClassKind.OrdinaryTable)
				.map(cls => {
					const { PrimaryKey } = printClassDetails(cls, printer);
					return `    {\n      name: "${cls.class_name}" as "${cls.class_name}",\n      primary_key: ${getImport(PrimaryKey)}\n    }`;
				})
				.join(",\n"),
			"  ]",
			"};",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "schema_data",
				name: types[0].schema_name,
				databaseName: types[0].database_name,
			},
		},
		SchemaValueRecord
	);

	return { SchemaTypeRecord, SchemaValueRecord };
}
