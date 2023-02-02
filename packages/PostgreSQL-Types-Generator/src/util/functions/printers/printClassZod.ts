import type { Printer } from "../../../classes/Printer";
import { ClassKind } from "../../../types/enums/ClassKind";
import { ConstraintType } from "../../../types/enums/ConstraintType";
import type { Attribute } from "../../../types/interfaces/Attribute";
import type { ClassDetails } from "../../../types/interfaces/ClassDetails";
import type { FileContext } from "../../../types/interfaces/FileContext";

export function printClassZod(type: ClassDetails, printer: Printer) {
	if (type.kind !== ClassKind.OrdinaryTable) throw new Error("printClassZod only supports ordinary tables at the moment.");

	const zInsertParameters = printer.context.pushValueDeclaration(
		{
			type: "z_insert_parameters",
			name: type.class_name,
			databaseName: type.database_name,
			schemaName: type.schema_name,
		},
		(identifierName, file) => [
			`const ${identifierName} = z.object({`,
			type.attributes
				.filter(a => a.attribute_number >= 0)
				.flatMap(attribute => [`  ${attribute.attribute_name}: ${getAttributeZod(type, attribute, printer, file)}${optionalOnInsert(attribute)}`])
				.join(",\n"),
			"});",
		]
	);

	printer.context.pushReExport(
		{
			type: "re_export",
			of: {
				type: "z_insert_parameters",
				name: type.class_name,
				databaseName: type.database_name,
				schemaName: type.schema_name,
			},
		},
		zInsertParameters
	);

	return { zInsertParameters };
}

function getAttributeZod(type: ClassDetails, attribute: Attribute, printer: Printer, file: FileContext): string {
	if (!attribute.not_null) return `z.nullable(${getAttributeZod(type, { ...attribute, not_null: true }, printer, file)})`;

	const columnTypeOverride =
		printer.config.types.zod.columnZodOverrides[`${type.schema_name}.${type.class_name}.${attribute.attribute_name}`] ||
		printer.config.types.zod.columnZodOverrides[`${type.class_name}.${attribute.attribute_name}`];

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
					const { zInsertParameters } = printClassZod(referencedClass, printer);

					return `${file.getImport(zInsertParameters)}['${referencedAttribute.attribute_name}']`;
				}
			}
		}
	}

	return printer.getZodType(attribute.type_id, file);
}

function optionalOnInsert(attribute: Attribute): string {
	if (!attribute.not_null) return ".optional()";
	if (attribute.has_default) return ".optional()";
	return "";
}
