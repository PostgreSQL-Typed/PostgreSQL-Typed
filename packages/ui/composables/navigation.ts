import { databases, findById } from "./data";

export interface Parameters {
	database: string | undefined;
	table: string | undefined;
	view: undefined | "graph" | "diagram" | "editor";
}

export const parameters = useUrlSearchParams<Parameters>("hash-params", {
	initialValue: {
		database: undefined,
		table: undefined,
		view: undefined,
	},
});

export const activeDatabase = toRef(parameters, "database");
export const activeTableId = toRef(parameters, "table");
export const viewMode = toRef(parameters, "view");

export const dashboardVisible = ref(true);

export function showDashboard(show: boolean) {
	dashboardVisible.value = show;
	if (show) activeTableId.value = undefined;
}

export function initNavigation() {
	const database = activeDatabase.value;
	if (database) {
		const exists = databases.value.find(d => d.id === database);
		if (!exists) {
			activeDatabase.value = databases.value[0].id;
			activeTableId.value = undefined;
		}
	} else activeDatabase.value = databases.value[0].id;

	const tableId = activeTableId.value;
	if (tableId) {
		const table = findById(tableId);
		if (table !== undefined) dashboardVisible.value = false;
	}
}
