import type { FetchedData } from "@postgresql-typed/cli/lib/types/interfaces/FetchedData";
import prettyBytes from "pretty-bytes";
import { activeDatabase, activeTableId } from "./navigation";

const data = ref<FetchedData[]>([]);

export const setData = (newData: FetchedData[]) => {
	newData.sort((a, b) => a.database.localeCompare(b.database));
	for (const database of newData) {
		database.tables.sort((a, b) => {
			const formattedName = `${a.schema_name}.${a.table_name}`.toLowerCase(),
				formattedName2 = `${b.schema_name}.${b.table_name}`.toLowerCase();
			return formattedName.localeCompare(formattedName2);
		});
	}
	data.value = newData;
};

export const hasData = computed(() => data.value.length > 0);
export const hasMultipleDatabases = computed(() => data.value.length > 1);
export const databases = computed(() => data.value.map(d => d.database));
export const tables = computed(() => data.value.find(d => d.database === activeDatabase.value)?.tables ?? []);
export const tableCount = computed(() => tables.value.length);
export const schemaCount = computed(() => {
	const database = data.value.find(d => d.database === activeDatabase.value);
	if (!database) return 0;

	const schemas = new Set<string>();
	for (const table of database.tables) schemas.add(table.schema_name);
	return schemas.size;
});
export const dbSize = computed(() => {
	const database = data.value.find(d => d.database === activeDatabase.value);
	if (!database) return prettyBytes(0);

	let size = 0;
	for (const table of database.tables) size += parseInt(table.size);

	return prettyBytes(size);
});

export const findById = (id: string) => {
	const database = data.value.find(d => d.database === activeDatabase.value);
	if (!database) return undefined;
	for (const table of database.tables) if (table.table_id.toString() === id) return table;
	return undefined;
};
export const activeTable = computed(() => (activeTableId.value ? findById(activeTableId.value) : undefined));
export const activeTableClass = computed(() => {
	const table = activeTable.value;
	if (!table) return undefined;

	const database = data.value.find(d => d.database === activeDatabase.value);
	if (!database) return undefined;

	return database.classes.find(c => c.class_id === table.table_id);
});
export const classById = (id: number) => {
	const database = data.value.find(d => d.database === activeDatabase.value);
	if (!database) return undefined;

	const found = database.classes.find(c => c.class_id === id);
	if (found) return found;

	return undefined;
};
export const classByPath = (path: string) => {
	const database = data.value.find(d => d.database === activeDatabase.value);
	if (!database) return undefined;

	const [schema, table, column] = path.split(".");
	if (!column || !table || !schema) return undefined;

	const found = database.classes.find(c => c.schema_name === schema && c.class_name === table);
	if (found) return found;

	return undefined;
};
export const attByPath = (path: string) => {
	const cls = classByPath(path);
	if (!cls) return undefined;

	const [schema, table, column] = path.split(".");
	if (!column || !table || !schema) return undefined;

	const found = cls.attributes.find(a => a.attribute_name === column);
	if (found) return found;

	return undefined;
};
export const relations = computed(() => {
	const nodes: {
			class_id: number;
			class_name: string;
		}[] = [],
		links: {
			source: number;
			target: number;
			text: string;
		}[] = [];

	const database = data.value.find(d => d.database === activeDatabase.value);
	if (!database) return { nodes, links };

	for (const cls of database.classes) {
		for (const constraint of cls.constraints) {
			if (constraint.constraint_type !== "f") continue;

			const refClass = classById(constraint.referenced_class_id);
			if (!refClass) continue;

			const refAttr = refClass.attributes.find(a => a.attribute_number === constraint.referenced_attribute_numbers[0]);
			const attr = cls.attributes.find(a => a.attribute_number === constraint.table_attribute_numbers[0]);
			if (!refAttr || !attr) continue;

			if (!nodes.some(n => n.class_id === cls.class_id)) nodes.push({ class_id: cls.class_id, class_name: cls.class_name });
			if (!nodes.some(n => n.class_id === refClass.class_id)) nodes.push({ class_id: refClass.class_id, class_name: refClass.class_name });
			const text = `${attr.attribute_name} → ${refAttr.attribute_name}`;
			if (!links.some(l => l.source === cls.class_id && l.target === refClass.class_id && l.text === text))
				links.push({
					source: cls.class_id,
					target: refClass.class_id,
					text,
				});
		}

		for (const attr of cls.attributes) {
			if (!attr.comment) continue;

			const commentData = parseColumnComment(attr.comment);
			if (!commentData.link) continue;

			const refClass = classByPath(commentData.link);
			if (!refClass) continue;

			const refAttr = attByPath(commentData.link);
			if (!refAttr) continue;

			if (!nodes.some(n => n.class_id === cls.class_id)) nodes.push({ class_id: cls.class_id, class_name: cls.class_name });
			if (!nodes.some(n => n.class_id === refClass.class_id)) nodes.push({ class_id: refClass.class_id, class_name: refClass.class_name });
			const text = `${attr.attribute_name}* → ${refAttr.attribute_name}`;
			if (!links.some(l => l.source === cls.class_id && l.target === refClass.class_id && l.text === text))
				links.push({
					source: cls.class_id,
					target: refClass.class_id,
					text,
				});
		}
	}

	return {
		nodes,
		links,
	};
});
export const getRelationsRelatedTo = (
	classId: number
): {
	nodes: {
		class_id: string;
		class_name: string;
	}[];
	links: {
		source: string;
		target: string;
		text: string;
	}[];
} => {
	const rel = relations.value,
		links: {
			source: number;
			target: number;
			text: string;
		}[] = rel.links.filter(l => l.source === classId || l.target === classId),
		nodes: {
			class_id: number;
			class_name: string;
		}[] = rel.nodes.filter(n => links.some(l => l.source === n.class_id || l.target === n.class_id));

	return {
		nodes: nodes.map(n => ({ class_id: n.class_id.toString(), class_name: n.class_name })),
		links: links.map(l => ({
			source: l.source.toString(),
			target: l.target.toString(),
			text: l.text,
		})),
	};
};

/**
 * Parses link and extra columns from a column comment
 *
 * @param comment Comment to parse
 * @param splitChar Character to split comment into lines
 * @returns Object containing links, extra columns and description
 */
export function parseColumnComment(comment: string) {
	const splitChar = "|"; //TODO: make this configurable
	//* Split comment into lines using splitChar as delimiter (as long as the splitChar is not escaped)
	const lines = comment.split(new RegExp(`(?<!\\\\)[${splitChar}]`)).map(line => line.replace(/\\\|/g, "|"));
	const links = parseLink(lines);
	if (links.succeeded) lines.splice(lines.indexOf(links.originalLine), 1);
	const extraColumns = parseExtraColumns(lines);
	if (extraColumns.succeeded) for (const originalLine of extraColumns.originalLines) lines.splice(lines.indexOf(originalLine), 1);

	return {
		link: links.succeeded ? links.link : undefined,
		extraColumns: extraColumns.succeeded ? extraColumns.extraColumns : undefined,
		description: lines.filter(Boolean).join(splitChar),
	};
}

/**
 * Parses link from a column comment
 *
 * @example link:schema.table.column
 * @example link=schema.table.column
 *
 * @param lines Lines to parse
 * @returns Object containing links and original line
 */
function parseLink(lines: string[]):
	| {
			succeeded: true;
			link: string;
			originalLine: string;
	  }
	| {
			succeeded: false;
	  } {
	//* If the line starts with links: or links=, the rest of the line is the link
	const linksLine = lines.find(line => line.startsWith("link:") || line.startsWith("link="));
	if (!linksLine) return { succeeded: false };
	return {
		succeeded: true,
		link: linksLine.replace(/^link[:=]/, ""),
		originalLine: linksLine,
	};
}

/**
 * Parses extra columns from a column comment
 *
 * @example [key]:value
 * @example [key]=value
 *
 * @param lines Lines to parse
 * @returns Object containing extra columns and original lines
 */
function parseExtraColumns(lines: string[]):
	| {
			succeeded: true;
			extraColumns: { [key: string]: string };
			originalLines: string[];
	  }
	| {
			succeeded: false;
	  } {
	const extraColumns: { [key: string]: string } = {};
	const originalLines: string[] = [];
	for (const line of lines) {
		//* If the line starts with [key]: or [key]=, parse the rest of the line as the value (it must also contain the square brackets)
		const match = line.match(/^(?<key>[^:]+):(?<value>.+)/) || line.match(/^(?<key>[^=]+)=(?<value>.+)/);
		if (!match) continue;
		let { key, value } = match.groups!;
		if (!key || !value) continue;
		//* Try to parse the value
		try {
			value = JSON.parse(value);
		} catch {}

		//* Remove the square brackets from the key
		extraColumns[key.replace(/^\[|\]$/g, "")] = value;
		originalLines.push(line);
	}

	if (Object.keys(extraColumns).length === 0) return { succeeded: false };
	return {
		succeeded: true,
		extraColumns,
		originalLines: originalLines,
	};
}
