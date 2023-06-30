import type { Printer } from "../../../classes/Printer.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printSchemaReexport } from "./printSchemaReexport.js";

export function printDatabaseReexport(types: ClassDetails[], printer: Printer) {
	const schemaClassList: ClassDetails[][] = [];

	for (const cls of types) {
		const list = schemaClassList.find(c => c[0].schema_name === cls.schema_name);
		if (list) list.push(cls);
		else schemaClassList.push([cls]);
	}

	const DatabaseReexportRecord = printer.context.pushTypeDeclaration(
		{
			type: "databaseReexport",
			name: types[0].database_name,
		},
		(_, { getRelativePath }) => [
			schemaClassList
				.map(types => {
					const { SchemaReexportRecord } = printSchemaReexport(types, printer);
					return `export * from "${getRelativePath(SchemaReexportRecord)}";`;
				})
				.join("\n"),
		]
	);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "databaseReexport",
				name: types[0].database_name,
			},
		},
		DatabaseReexportRecord
	);

	return { DatabaseReexportRecord };
}
