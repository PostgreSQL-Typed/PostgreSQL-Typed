<script setup lang="ts">
	import type { Table } from "@postgresql-typed/cli/lib/types/interfaces/Table";
	import prettyBytes from "pretty-bytes";

	const properties = defineProps<{
			table: Table;
		}>(),
		size = computed(() => prettyBytes(Number.parseInt(properties.table.size)));
</script>

<template>
	<div v-if="properties.table" flex="~ row" items-center p="x-2 y-1" border-rounded cursor-pointer hover="bg-active">
		<div flex items-end gap-2>
			<span text-sm truncate font-light>{{ properties.table.schema_name }}.{{ properties.table.table_name }}</span>
			<span text="xs" op20 style="white-space: nowrap"> {{ size }} </span>
		</div>
	</div>
</template>
