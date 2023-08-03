<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
	import type { Table } from "@postgresql-typed/cli/lib/types/interfaces/Table";

	import { activeTableId } from "@/composables/navigation";

	const properties = withDefaults(
			defineProps<{
				tables: Table[];
				// eslint-disable-next-line func-call-spacing
				onItemClick?: (table: Table) => void;
			}>(),
			{}
		),
		search = ref(""),
		searchBox = ref<HTMLInputElement | undefined>(),
		isFiltered = computed(() => search.value.trim() !== ""),
		matchTable = (table: Table, search: string): boolean => {
			const formatted = `${table.schema_name}.${table.table_name}`.toLowerCase();
			return formatted.includes(search.toLowerCase());
		},
		filtered = computed(() => {
			if (!search.value.trim()) return properties.tables;
			return properties.tables.filter(task => matchTable(task, search.value));
		}),
		filteredTests: ComputedRef<Table[]> = computed(() => (isFiltered.value ? filtered.value : [])),
		clearSearch = (focus: boolean) => {
			search.value = "";
			focus && searchBox.value?.focus();
		},
		disableClearSearch = computed(() => {
			return search.value === "";
		});
</script>

<script lang="ts">
	export default {
		inheritAttrs: false,
	};
</script>

<template>
	<div h="full" flex="~ col">
		<div>
			<div p="2" h-10 flex="~ gap-2" items-center bg-header border="b base">
				<slot name="header" :filtered-tests="isFiltered ? filteredTests : undefined" />
			</div>
			<div p="l3 y2 r2" flex="~ gap-2" items-center bg-header border="b-2 base">
				<div class="i-carbon:search" flex-shrink-0 />
				<input
					ref="searchBox"
					v-model="search"
					placeholder="Search..."
					outline="none"
					bg="transparent"
					font="light"
					text="sm"
					flex-1
					pl-1
					:op="search.length > 0 ? '100' : '50'"
					@keydown.esc="clearSearch(false)"
				/>
				<IconButton
					v-tooltip.bottom="'Clear search'"
					:disabled="disableClearSearch"
					title="Clear search"
					icon="i-carbon:filter-remove"
					@click.passive="clearSearch(true)"
				/>
			</div>
		</div>

		<div class="scrolls" flex-auto py-1>
			<template v-if="isFiltered && filtered.length === 0">
				<div flex="~ col" items-center p="x4 y4" font-light>
					<div op30>No matched test</div>
					<button font-light op="50 hover:100" text-sm border="~ gray-400/50 rounded" p="x2 y0.5" m="t2" @click.passive="clearSearch(true)">Clear</button>
				</div>
			</template>
			<template v-else>
				<TableItem
					v-for="table in filtered"
					:key="table.table_id"
					v-bind="$attrs"
					:class="activeTableId === table.table_id.toString() ? 'bg-active' : ''"
					:table="table"
					@click="properties.onItemClick && properties.onItemClick(table)"
				/>
			</template>
		</div>
	</div>
</template>
