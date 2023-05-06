import type { FetchedData } from "@postgresql-typed/cli/lib/types/interfaces/FetchedData";
import ky, { HTTPError } from "ky";
import prettyBytes from "pretty-bytes";
import { defaultCardinality, defaultRelationship, parseColumnComment } from "@/util/functions";
import { activeDatabase, activeTableId } from "./navigation";

export const data = ref<(FetchedData & { id: string })[]>([]);
const defaultError = "Check your terminal or make a new build with `pgt --ui`";
export const errorMessage = ref(defaultError);

export const loading = ref(false);

export const fetchData = async () => {
	if (loading.value) return;
	try {
		loading.value = true;
		setData(
			await ky("/api/data", {
				timeout: false,
			}).json()
		);
		initNavigation();
		loading.value = false;
	} catch (e) {
		if (!(e instanceof HTTPError)) {
			errorMessage.value = defaultError;
		} else errorMessage.value = (await e.response.json()).message;
		loading.value = false;
	}
};

export const setData = (newData: (FetchedData & { id: string })[]) => {
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
export const databases = computed(() =>
	data.value.map(d => ({
		database: d.database,
		hostPort: d.hostPort,
		id: d.id,
	}))
);
export const database = computed(
	() =>
		data.value.find(d => d.id === activeDatabase.value) ?? {
			database: "postgres",
			hostPort: "localhost:5432",
			id: encodeURIComponent("localhost:5432/postgres"),
		}
);
export const tables = computed(() => data.value.find(d => d.id === activeDatabase.value)?.tables ?? []);
export const tableCount = computed(() => tables.value.length);
export const schemaCount = computed(() => {
	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return 0;

	const schemas = new Set<string>();
	for (const table of database.tables) schemas.add(table.schema_name);
	return schemas.size;
});
export const dbSize = computed(() => {
	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return prettyBytes(0);

	let size = 0;
	for (const table of database.tables) size += parseInt(table.size);

	return prettyBytes(size);
});

export const databaseById = (id: string) =>
	data.value.find(d => d.id === id) ?? {
		database: "postgres",
		hostPort: "localhost:5432",
		id: encodeURIComponent("localhost:5432/postgres"),
	};
export const findById = (id: string) => {
	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return undefined;
	for (const table of database.tables) if (table.table_id.toString() === id) return table;
	return undefined;
};
export const activeTable = computed(() => (activeTableId.value ? findById(activeTableId.value) : undefined));
export const activeTableClass = computed(() => {
	const table = activeTable.value;
	if (!table) return undefined;

	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return undefined;

	return database.classes.find(c => c.class_id === table.table_id);
});
export const classById = (id: number) => {
	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return undefined;

	const found = database.classes.find(c => c.class_id === id);
	if (found) return found;

	return undefined;
};
export const classByPath = (path: string) => {
	const database = data.value.find(d => d.id === activeDatabase.value);
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
export const attIsPK = (attribute_number: number, class_id: number): boolean => {
	const cls = classById(class_id);
	if (!cls) return false;

	return cls.constraints.some(c => c.constraint_type === "p" && c.table_attribute_numbers.includes(attribute_number));
};
export const attIsFK = (attribute_number: number, class_id: number): boolean => {
	const cls = classById(class_id);
	if (!cls) return false;

	const att = cls.attributes.find(a => a.attribute_number === attribute_number);
	if (!att) return false;

	const parsedComment = parseColumnComment(att.comment ?? "");

	return cls.constraints.some(c => c.constraint_type === "f" && c.table_attribute_numbers.includes(attribute_number)) || parsedComment.link !== undefined;
};
export const attIsUnique = (attribute_number: number, class_id: number): boolean => {
	const cls = classById(class_id);
	if (!cls) return false;

	return cls.constraints.some(c => c.constraint_type === "u" && c.table_attribute_numbers.includes(attribute_number));
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
			cardinality: string;
			relationship: string;
		}[] = [];

	const database = data.value.find(d => d.id === activeDatabase.value);
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
					cardinality: defaultCardinality,
					relationship: defaultRelationship,
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
					cardinality: commentData.cardinality ?? defaultCardinality,
					relationship: commentData.relationship ?? defaultRelationship,
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
		cardinality: string;
		relationship: string;
	}[];
} => {
	const rel = relations.value,
		links: {
			source: number;
			target: number;
			text: string;
			cardinality: string;
			relationship: string;
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
			cardinality: l.cardinality,
			relationship: l.relationship,
		})),
	};
};
