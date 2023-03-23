import { activeTable, getRelationsRelatedTo, classById, attIsFK, attIsPK, attIsUnique } from "@/composables/data";

export function getERD(): string {
	const table = activeTable.value;
	if (!table) return "";
	const { nodes, links } = getRelationsRelatedTo(table.table_id);

	if (!nodes.length) {
		const tableColumns = classById(table.table_id)?.attributes || [];
		return `erDiagram\n\t${table.table_name} {\n\t\t${tableColumns
			.map(c => {
				let extraString = "";
				if (!c.not_null) extraString += " Nullable,";
				if (attIsPK(c.attribute_number, c.class_id)) extraString += " PK,";
				if (attIsFK(c.attribute_number, c.class_id)) extraString += " FK,";
				if (attIsUnique(c.attribute_number, c.class_id)) extraString += " Unique,";
				//if (c.has_default) extraString += ` Default: ${c.default}`;
				if (extraString.endsWith(",")) extraString = extraString.slice(0, -1);
				return `${c.type_name.replaceAll(" ", "_").replaceAll(",", "_")} ${c.attribute_name}${extraString ? ` "${extraString.trim()}"` : ""}`;
			})
			.join("\n\t\t")}\n\t}\n`;
	}

	return `erDiagram\n\t${nodes
		.map(
			node =>
				`${node.class_name}{\n\t\t${classById(parseInt(node.class_id))
					?.attributes?.map(c => {
						let extraString = "";
						if (!c.not_null) extraString += " Nullable,";
						if (attIsPK(c.attribute_number, c.class_id)) extraString += " PK,";
						if (attIsFK(c.attribute_number, c.class_id)) extraString += " FK,";
						if (attIsUnique(c.attribute_number, c.class_id)) extraString += " Unique,";
						//if (c.has_default) extraString += ` Default: ${c.default}`;
						if (extraString.endsWith(",")) extraString = extraString.slice(0, -1);
						return `${c.type_name.replaceAll(" ", "_").replaceAll(",", "_")} ${c.attribute_name}${extraString ? ` "${extraString.trim()}"` : ""}`;
					})
					.join("\n\t\t")}\n\t}`
		)
		.join("\n\t")}\n\t${links
		.map(link => {
			const source = classById(parseInt(link.source))?.class_name || link.source,
				target = classById(parseInt(link.target))?.class_name || link.target;
			return `${source} ${link.cardinality} ${target}: "${link.relationship}"`;
		})
		.join("\n\t")}`;
}
