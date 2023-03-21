<script setup lang="ts">
	import type { Table } from "@postgresql-typed/cli/lib/types/interfaces/Table";
	import prettyBytes from "pretty-bytes";

	const props = defineProps<{
		table: Table;
	}>();
	const size = computed(() => prettyBytes(parseInt(props.table.size)));
</script>

<template>
	<div v-if="props.table" flex="~ row" items-center p="x-2 y-1" border-rounded cursor-pointer hover="bg-active">
		<div flex items-end gap-2>
			<span text-sm truncate font-light>{{ props.table.schema_name }}.{{ props.table.table_name }}</span>
			<span text="xs" op20 style="white-space: nowrap"> {{ size }} </span>
		</div>
	</div>
</template>
