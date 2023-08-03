import { parseColumnComment } from "~~/util/functions";

import { generateData } from "./data";

export default defineEventHandler(async () => {
	const data = await generateData();
	return data.map(database => {
		const schemas = [...new Set(database.tables.map(table => table.schema_id))];
		return {
			database_name: database.database,
			database_url: database.hostPort,
			schemas: schemas.map(schema => {
				const tables = database.tables.filter(table => table.schema_id === schema);
				return {
					schema_name: tables[0]?.schema_name,
					tables: tables.map(table => {
						return {
							columns: (database.classes.find(c => c.class_id === table.table_id)?.attributes || []).map(attribute => {
								if (!attribute.comment) {
									return {
										column_default: attribute.default,
										column_name: attribute.attribute_name,
										comment: "",
										data_type: attribute.type_name,
										is_nullable: !attribute.not_null,
									};
								}

								const parsedComment = parseColumnComment(attribute.comment);

								return {
									column_default: attribute.default,
									column_name: attribute.attribute_name,
									comment: parsedComment.description,
									data_type: attribute.type_name,
									is_nullable: !attribute.not_null,
									...parsedComment.extraColumns,
								};
							}),
							table_name: table.table_name,
						};
					}),
				};
			}),
		};
	});
});
