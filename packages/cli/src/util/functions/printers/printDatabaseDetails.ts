import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printSchemaDetails } from "../../functions/printers/printSchemaDetails.js";

export function printDatabaseDetails(types: ClassDetails[], printer: Printer) {
	if (types.some(type => type.kind !== ClassKind.OrdinaryTable)) throw new Error("printDatabaseDetails only supports ordinary tables at the moment.");

	const schemaClassList: ClassDetails[][] = [];

	for (const cls of types) {
		const list = schemaClassList.find(c => c[0].schema_name === cls.schema_name);
		if (list) list.push(cls);
		else schemaClassList.push([cls]);
	}

	const DatabaseTypeRecord = printer.context.pushTypeDeclaration(
		{
			type: "database_type",
			name: types[0].database_name,
		},
		(identifier, { getImport }) => [
			`interface ${identifier} {`,
			`  name: "${types[0].database_name}";`,
			"  schemas: {",
			...schemaClassList.map(cls => {
				const { SchemaTypeRecord } = printSchemaDetails(cls, printer);
				return `    ${cls[0].schema_name}: ${getImport(SchemaTypeRecord)}`;
			}),
			"  }",
			"}",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "database_type",
				name: types[0].database_name,
			},
		},
		DatabaseTypeRecord
	);

	const DatabaseValueRecord = printer.context.pushValueDeclaration(
		{
			type: "database_data",
			name: types[0].database_name,
		},
		(identifier, { getImport }) => [
			`const ${identifier} = {`,
			`  name: "${types[0].database_name}" as const,`,
			"  schemas: [",
			schemaClassList
				.map(cls => {
					const { SchemaValueRecord } = printSchemaDetails(cls, printer);
					return `    ${getImport(SchemaValueRecord)}`;
				})
				.join(",\n"),
			"  ]",
			"}",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "database_data",
				name: types[0].database_name,
			},
		},
		DatabaseValueRecord
	);

	return { DatabaseTypeRecord, DatabaseValueRecord };
}
