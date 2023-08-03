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
	} catch (error) {
		// eslint-disable-next-line unicorn/no-await-expression-member
		errorMessage.value = error instanceof HTTPError ? (await error.response.json()).message : defaultError;
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
export const databaseSize = computed(() => {
	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return prettyBytes(0);

	let size = 0;
	for (const table of database.tables) size += Number.parseInt(table.size);

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
	if (!database) return;
	for (const table of database.tables) if (table.table_id.toString() === id) return table;
	return;
};
export const activeTable = computed(() => (activeTableId.value ? findById(activeTableId.value) : undefined));
export const activeTableClass = computed(() => {
	const table = activeTable.value;
	if (!table) return;

	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return;

	return database.classes.find(c => c.class_id === table.table_id);
});
export const classById = (id: number) => {
	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return;

	const found = database.classes.find(c => c.class_id === id);
	if (found) return found;

	return;
};
export const classByPath = (path: string) => {
	const database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return;

	const [schema, table, column] = path.split(".");
	if (!column || !table || !schema) return;

	const found = database.classes.find(c => c.schema_name === schema && c.class_name === table);
	if (found) return found;

	return;
};
export const attByPath = (path: string) => {
	const cls = classByPath(path);
	if (!cls) return;

	const [schema, table, column] = path.split(".");
	if (!column || !table || !schema) return;

	const found = cls.attributes.find(a => a.attribute_name === column);
	if (found) return found;

	return;
};
export const attIsPK = (attributeNumber: number, classId: number): boolean => {
	const cls = classById(classId);
	if (!cls) return false;

	return cls.constraints.some(c => c.constraint_type === "p" && c.table_attribute_numbers.includes(attributeNumber));
};
export const attIsFK = (attributeNumber: number, classId: number): boolean => {
	const cls = classById(classId);
	if (!cls) return false;

	const att = cls.attributes.find(a => a.attribute_number === attributeNumber);
	if (!att) return false;

	const parsedComment = parseColumnComment(att.comment ?? "");

	return cls.constraints.some(c => c.constraint_type === "f" && c.table_attribute_numbers.includes(attributeNumber)) || parsedComment.link !== undefined;
};
export const attIsUnique = (attributeNumber: number, classId: number): boolean => {
	const cls = classById(classId);
	if (!cls) return false;

	return cls.constraints.some(c => c.constraint_type === "u" && c.table_attribute_numbers.includes(attributeNumber));
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
		}[] = [],
		database = data.value.find(d => d.id === activeDatabase.value);
	if (!database) return { links, nodes };

	for (const cls of database.classes) {
		for (const constraint of cls.constraints) {
			if (constraint.constraint_type !== "f") continue;

			const referenceClass = classById(constraint.referenced_class_id);
			if (!referenceClass) continue;

			const referenceAttribute = referenceClass.attributes.find(a => a.attribute_number === constraint.referenced_attribute_numbers[0]),
				attribute = cls.attributes.find(a => a.attribute_number === constraint.table_attribute_numbers[0]);
			if (!referenceAttribute || !attribute) continue;

			if (!nodes.some(n => n.class_id === cls.class_id)) nodes.push({ class_id: cls.class_id, class_name: cls.class_name });
			if (!nodes.some(n => n.class_id === referenceClass.class_id)) nodes.push({ class_id: referenceClass.class_id, class_name: referenceClass.class_name });
			const text = `${attribute.attribute_name} → ${referenceAttribute.attribute_name}`;
			if (!links.some(l => l.source === cls.class_id && l.target === referenceClass.class_id && l.text === text)) {
				links.push({
					cardinality: defaultCardinality,
					relationship: defaultRelationship,
					source: cls.class_id,
					target: referenceClass.class_id,
					text,
				});
			}
		}

		for (const attribute of cls.attributes) {
			if (!attribute.comment) continue;

			const commentData = parseColumnComment(attribute.comment);
			if (!commentData.link) continue;

			const referenceClass = classByPath(commentData.link);
			if (!referenceClass) continue;

			const referenceAttribute = attByPath(commentData.link);
			if (!referenceAttribute) continue;

			if (!nodes.some(n => n.class_id === cls.class_id)) nodes.push({ class_id: cls.class_id, class_name: cls.class_name });
			if (!nodes.some(n => n.class_id === referenceClass.class_id)) nodes.push({ class_id: referenceClass.class_id, class_name: referenceClass.class_name });
			const text = `${attribute.attribute_name}* → ${referenceAttribute.attribute_name}`;
			if (!links.some(l => l.source === cls.class_id && l.target === referenceClass.class_id && l.text === text)) {
				links.push({
					cardinality: commentData.cardinality ?? defaultCardinality,
					relationship: commentData.relationship ?? defaultRelationship,
					source: cls.class_id,
					target: referenceClass.class_id,
					text,
				});
			}
		}
	}

	return {
		links,
		nodes,
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
	const relation = relations.value,
		links: {
			source: number;
			target: number;
			text: string;
			cardinality: string;
			relationship: string;
		}[] = relation.links.filter(l => l.source === classId || l.target === classId),
		nodes: {
			class_id: number;
			class_name: string;
		}[] = relation.nodes.filter(n => links.some(l => l.source === n.class_id || l.target === n.class_id));

	return {
		links: links.map(l => ({
			cardinality: l.cardinality,
			relationship: l.relationship,
			source: l.source.toString(),
			target: l.target.toString(),
			text: l.text,
		})),
		nodes: nodes.map(n => ({ class_id: n.class_id.toString(), class_name: n.class_name })),
	};
};
