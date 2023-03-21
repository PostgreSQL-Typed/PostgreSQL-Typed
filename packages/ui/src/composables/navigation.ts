import { databases, findById } from "./data";

export interface Params {
	database: string | undefined;
	table: string | undefined;
	view: undefined | "graph" | "diagram" | "editor";
}

export const params = useUrlSearchParams<Params>("hash-params", {
	initialValue: {
		database: undefined,
		table: undefined,
		view: undefined,
	},
});

export const activeDatabase = toRef(params, "database");
export const activeTableId = toRef(params, "table");
export const viewMode = toRef(params, "view");

export const dashboardVisible = ref(true);

export function showDashboard(show: boolean) {
	dashboardVisible.value = show;
	if (show) activeTableId.value = undefined;
}

export function initNavigation() {
	const database = activeDatabase.value;
	if (database) {
		const exists = databases.value.includes(database);
		if (!exists) {
			activeDatabase.value = databases.value[0];
			activeTableId.value = undefined;
		}
	} else activeDatabase.value = databases.value[0];

	const tableId = activeTableId.value;
	if (tableId) {
		const table = findById(tableId);
		if (table !== undefined) dashboardVisible.value = false;
	}
}
