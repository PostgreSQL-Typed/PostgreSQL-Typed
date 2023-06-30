import { Printer } from "../../../classes/Printer.js";
import { ClassDetails } from "../../../types/interfaces/ClassDetails.js";

export function printSchema(type: ClassDetails, printer: Printer) {
	const SchemaRecord = printer.context.pushValueDeclaration(
		{
			type: "schema",
			name: type.schema_name,
			databaseName: type.database_name,
		},
		(identifier, { addImportStatement }) => {
			addImportStatement({
				module: "@postgresql-typed/core",
				name: "schema",
				type: "named",
			});
			return [`const ${identifier} = schema("${type.schema_name}");`];
		}
	);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "schema",
				name: type.schema_name,
				databaseName: type.database_name,
			},
		},
		SchemaRecord
	);

	return { SchemaRecord };
}
