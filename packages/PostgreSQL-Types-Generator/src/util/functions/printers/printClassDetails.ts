import type { Printer } from "../../../classes/Printer.js";
import { ClassKind } from "../../../types/enums/ClassKind.js";
import { ConstraintType } from "../../../types/enums/ConstraintType.js";
import type { Attribute } from "../../../types/interfaces/Attribute.js";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails.js";
import type { FileContext } from "../../../types/interfaces/FileContext.js";

export function printClassDetails(type: ClassDetails, printer: Printer) {
	if (type.kind !== ClassKind.OrdinaryTable) throw new Error("printClassDetails only supports ordinary tables at the moment.");

	const DatabaseRecord = printer.context.pushTypeDeclaration(
		{
			type: "table",
			name: type.class_name,
			databaseName: type.database_name,
			schemaName: type.schema_name,
		},
		(identifierName, file) => [
			...getClassComment(type),
			`interface ${identifierName} {`,
			...type.attributes
				.filter(a => a.attribute_number >= 0)
				.flatMap(attribute => [...getAttributeComment(type, attribute), `  ${attribute.attribute_name}: ${getAttributeType(type, attribute, printer, file)}`]),
			"}",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "table",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		DatabaseRecord
	);

	const InsertParameters = printer.context.pushTypeDeclaration(
		{
			type: "insert_parameters",
			name: type.class_name,
			databaseName: type.database_name,
			schemaName: type.schema_name,
		},
		(identifierName, file) => [
			...getClassComment(type),
			`interface ${identifierName} {`,
			...type.attributes
				.filter(a => a.attribute_number >= 0)
				.flatMap(attribute => [
					...getAttributeComment(type, attribute),
					`  ${attribute.attribute_name}${optionalOnInsert(attribute)}: ${getAttributeType(type, attribute, printer, file)}`,
				]),
			"}",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "insert_parameters",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		InsertParameters
	);

	const PrimaryKey = printer.context.pushValueDeclaration(
		{
			type: "primary_key",
			name: type.class_name,
			databaseName: type.database_name,
			schemaName: type.schema_name,
		},
		identifierName => {
			for (const attribute of type.attributes.filter(a => a.attribute_number >= 0)) {
				const pk = type.constraints.find(
					c => c.table_attribute_numbers.includes(attribute.attribute_number) && c.constraint_type === ConstraintType.PrimaryKey
				);

				if (pk) return [`const ${identifierName}: "${attribute.attribute_name}" = "${attribute.attribute_name}"`];
			}
			return [`const ${identifierName}: undefined = undefined`];
		}
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "primary_key",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		PrimaryKey
	);

	return { DatabaseRecord, InsertParameters, PrimaryKey };
}

function getClassComment(cls: ClassDetails): string[] {
	const commentLines = [];
	if (cls.comment?.trim()) commentLines.push(...cls.comment.trim().split("\n"));

	return commentLines.length > 0 ? ["/**", ...commentLines.map(l => ` * ${l}`), " */"] : [];
}
function getAttributeComment(type: ClassDetails, attribute: Attribute): string[] {
	const commentLines = [];
	if (attribute.comment?.trim()) commentLines.push(...attribute.comment.trim().split("\n"));

	const pk = type.constraints.find(c => c.table_attribute_numbers.includes(attribute.attribute_number) && c.constraint_type === ConstraintType.PrimaryKey);

	if (pk) {
		if (commentLines.length > 0) commentLines.push("");
		commentLines.push("@kind PrimaryKey");
	}

	if (attribute.type_name) {
		if (commentLines.length > 0) commentLines.push("");
		commentLines.push(`@kind ${attribute.type_name}`);
	}

	if (attribute.default) {
		if (commentLines.length > 0) commentLines.push("");
		commentLines.push(`@default ${attribute.default}`);
	}

	return commentLines.length > 0 ? ["  /**", ...commentLines.map(l => `   * ${l}`), "   */"] : [];
}

function getAttributeType(type: ClassDetails, attribute: Attribute, printer: Printer, file: FileContext): string {
	if (!attribute.not_null) return `${getAttributeType(type, { ...attribute, not_null: true }, printer, file)} | null`;

	const columnTypeOverride =
		printer.config.types.columnTypeOverrides[`${type.schema_name}.${type.class_name}.${attribute.attribute_name}`] ||
		printer.config.types.columnTypeOverrides[`${type.class_name}.${attribute.attribute_name}`];

	if (columnTypeOverride) return columnTypeOverride;

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
					const { DatabaseRecord } = printClassDetails(referencedClass, printer);

					return `${file.getImport(DatabaseRecord)}['${referencedAttribute.attribute_name}']`;
				}
			}
		}
	}

	return printer.getTypeScriptType(attribute.type_id, file);
}

function optionalOnInsert(attribute: Attribute): string {
	if (!attribute.not_null) return "?";
	if (attribute.has_default) return "?";
	return "";
}
