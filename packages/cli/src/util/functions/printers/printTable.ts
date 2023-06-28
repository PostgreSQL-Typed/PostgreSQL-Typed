import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import { ConstraintType } from "../../../types/enums/ConstraintType.js";
import type { Attribute } from "../../../types/interfaces/Attribute.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";
import { printSchema } from "./printSchema.js";

export function printTable(type: ClassDetails, printer: Printer) {
	if (type.kind !== ClassKind.OrdinaryTable) throw new Error("printTable only supports ordinary tables at the moment.");

	const TableRecord = printer.context.pushValueDeclaration(
		{
			type: "table",
			name: type.class_name,
			databaseName: type.database_name,
			schemaName: type.schema_name,
		},
		(identifierName, file) => {
			const { SchemaRecord } = printSchema(type, printer);
			return [
				`const ${identifierName} = ${file.getImport(SchemaRecord)}.table("${type.class_name}", {`,
				...type.attributes.filter(a => a.attribute_number >= 0).map(attribute => printColumn(type, attribute, printer, file)),
				"});",
			];
		}
	);

	printer.context.pushReExport(
		{
			type: "export",
			of: {
				type: "table",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		TableRecord
	);

	return { TableRecord };
}

function printColumn(type: ClassDetails, attribute: Attribute, printer: Printer, file: FileContext): string {
	const { getDeclarationName } = file,
		name = getDeclarationName({
			type: "column",
			name: attribute.attribute_name,
			databaseName: type.database_name,
			schemaName: type.schema_name,
			tableName: type.class_name,
		});
	return `  ${name}: ${getAttribute(type, attribute, printer, file)},`;
}

function getAttribute(type: ClassDetails, attribute: Attribute, printer: Printer, file: FileContext): string {
	const columnTypeOverride =
		printer.config.files.columnDefinerOverrides[`${type.schema_name}.${type.class_name}.${attribute.attribute_name}`] ||
		printer.config.files.columnDefinerOverrides[`${type.class_name}.${attribute.attribute_name}`];

	if (columnTypeOverride) {
		const [importString, importStatement] = columnTypeOverride;
		for (const statement of importStatement) file.addImportStatement(statement);
		return importString;
	}

	let maxLength = attribute.max_length ?? undefined;
	if (maxLength === undefined) {
		const matchResult = attribute.type_name.match(/\((\d+)\)(\[])?$/);
		if (matchResult) maxLength = Number.parseInt(matchResult[1]);
	}

	const definer = printer
		.getDefiner(attribute.type_id, file, {
			maxLength,
			nonNull: attribute.not_null,
		})
		.replace("%ATTRIBUTE%", attribute.attribute_name);

	return `${definer}${getDefault(attribute, file)}${getReference(type, attribute, printer, file)}`;
}

function getReference(type: ClassDetails, attribute: Attribute, printer: Printer, file: FileContext): string {
	const { getDeclarationName, getImport } = file;
	for (const constraint of type.constraints) {
		if (
			constraint.table_attribute_numbers.includes(attribute.attribute_number) &&
			constraint.constraint_type === ConstraintType.ForeignKey &&
			constraint.referenced_class_id !== type.class_id
		) {
			const referencedClass = printer.getClass(constraint.referenced_class_id);
			if (referencedClass) {
				const referencedAttributeNumber = constraint.referenced_attribute_numbers[constraint.table_attribute_numbers.indexOf(attribute.attribute_number)],
					referencedAttribute = referencedClass.attributes.find(a => a.attribute_number === referencedAttributeNumber);

				if (referencedAttribute) {
					const { TableRecord } = printTable(referencedClass, printer);

					return `.references(() => ${getImport(TableRecord)}.${getDeclarationName({
						type: "column",
						name: referencedAttribute.attribute_name,
						databaseName: referencedClass.database_name,
						schemaName: referencedClass.schema_name,
						tableName: referencedClass.class_name,
					})})`;
				}
			}
		}
	}

	return "";
}

function getDefault(attribute: Attribute, file: FileContext): string {
	if (attribute.default) {
		file.addImportStatement({
			module: "@postgresql-typed/core",
			name: "sql",
			type: "named",
		});
		return `.default(sql\`${attribute.default}\`)`;
	}
	return "";
}