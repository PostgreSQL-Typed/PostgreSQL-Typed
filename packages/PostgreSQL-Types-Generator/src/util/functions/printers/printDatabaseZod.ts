import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import { printSchemaZod } from "../../functions/printers/printSchemaZod.js";

export function printDatabaseZod(types: ClassDetails[], printer: Printer) {
	if (types.some(type => type.kind !== ClassKind.OrdinaryTable)) throw new Error("printDatabaseZod only supports ordinary tables at the moment.");

	const schemaClassList: ClassDetails[][] = [];

	for (const cls of types) {
		const list = schemaClassList.find(c => c[0].schema_name === cls.schema_name);
		if (list) list.push(cls);
		else schemaClassList.push([cls]);
	}

	const DatabaseZodRecord = printer.context.pushValueDeclaration(
		{
			type: "z_database_data",
			name: types[0].database_name,
		},
		(identifier, { getImport }) => [
			`const ${identifier} = {`,
			`  name: "${types[0].database_name}" as "${types[0].database_name}",`,
			"  schemas: [",
			schemaClassList
				.map(cls => {
					const { SchemaZodRecord } = printSchemaZod(cls, printer);
					return `    ${getImport(SchemaZodRecord)}`;
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
				type: "z_database_data",
				name: types[0].database_name,
			},
		},
		DatabaseZodRecord
	);

	return { DatabaseZodRecord };
}
