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
							table_name: table.table_name,
							columns: (database.classes.find(c => c.class_id === table.table_id)?.attributes || []).map(attr => {
								if (!attr.comment)
									return {
										column_name: attr.attribute_name,
										data_type: attr.type_name,
										column_default: attr.default,
										is_nullable: !attr.not_null,
										comment: "",
									};

								const parsedComment = parseColumnComment(attr.comment);

								return {
									column_name: attr.attribute_name,
									data_type: attr.type_name,
									column_default: attr.default,
									is_nullable: !attr.not_null,
									comment: parsedComment.description,
									...(parsedComment.extraColumns || {}),
								};
							}),
						};
					}),
				};
			}),
		};
	});
});
