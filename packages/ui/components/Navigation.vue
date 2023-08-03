<script setup lang="ts">
	import type { Table } from "@postgresql-typed/cli/lib/types/interfaces/Table";

	import { isDark, toggleDark } from "@/composables/dark";
	import { fetchData, tables } from "@/composables/data";
	import { activeTableId, dashboardVisible, showDashboard } from "@/composables/navigation";

	const toggleMode = computed(() => (isDark.value ? "light" : "dark")),
		onItemClick = (table: Table) => {
			activeTableId.value = table.table_id.toString();
			showDashboard(false);
		};
</script>

<template>
	<TableList :tables="tables" :on-item-click="onItemClick">
		<template #header>
			<img w-6 h-6 src="/favicon.svg" alt="PostgreSQL-Typed logo" />
			<span font-light text-sm flex-1 ws-nowrap>PostgreSQL-Typed</span>
			<div class="flex text-lg">
				<IconButton
					v-show="!dashboardVisible"
					v-tooltip.bottom="'Dashboard'"
					title="Show dashboard"
					class="!animate-100ms"
					animate-count-1
					icon="i-carbon-dashboard"
					@click="showDashboard(true)"
				/>
				<IconButton v-tooltip.bottom="'Refresh'" icon="i-carbon-renew" @click="fetchData()" />
				<IconButton v-tooltip.bottom="`Toggle to ${toggleMode} mode`" icon="dark:i-carbon-moon i-carbon-sun" @click="toggleDark()" />
			</div>
		</template>
	</TableList>
</template>
