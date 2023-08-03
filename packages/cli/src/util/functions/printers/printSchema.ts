import { Printer } from "../../../classes/Printer.js";
import { ClassDetails } from "../../../types/interfaces/ClassDetails.js";

export function printSchema(type: ClassDetails, printer: Printer) {
	const SchemaRecord = printer.context.pushValueDeclaration(
		{
			databaseName: type.database_name,
			name: type.schema_name,
			type: "schema",
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
			of: {
				databaseName: type.database_name,
				name: type.schema_name,
				type: "schema",
			},
			type: "export",
		},
		SchemaRecord
	);

	if (!printer.config.files.preCompile) return { SchemaRecord };

	const SchemaTypeRecord = printer.context.pushValueDeclaration(
		{
			databaseName: type.database_name,
			name: type.schema_name,
			type: "schemaType",
		},
		(identifier, { addImportStatement }) => {
			addImportStatement({
				isType: true,
				module: "@postgresql-typed/core",
				name: "PgSchema",
				type: "named",
			});
			return [`declare const ${identifier}: PgSchema<"${type.schema_name}">;`];
		}
	);

	printer.context.pushReExport(
		{
			of: {
				databaseName: type.database_name,
				name: type.schema_name,
				type: "schemaType",
			},
			type: "export",
		},
		SchemaTypeRecord
	);

	return { SchemaRecord, SchemaTypeRecord };
}
