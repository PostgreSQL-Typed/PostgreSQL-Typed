<script setup lang="ts">
	import { activeTableClass } from "@/composables/data";
	import { parseColumnComment } from "@/util/functions";

	const columns = computed((): Record<string, any>[] => {
		return (activeTableClass.value?.attributes || []).map(attr => {
			if (!attr.comment)
				return {
					column_name: attr.attribute_name,
					data_type: attr.type_name,
					column_default: attr.default,
					is_nullable: !attr.not_null,
					comment: "",
				};

			const parsedComment = parseColumnComment(attr.comment);

			return {
				column_name: attr.attribute_name,
				data_type: attr.type_name,
				column_default: attr.default,
				is_nullable: !attr.not_null,
				comment: parsedComment.description,
				...(parsedComment.extraColumns || {}),
			};
		});
	});

	const defaultHeaders = {
		column_name: "Column Name",
		data_type: "Data Type",
		column_default: "Default",
		is_nullable: "Nullable",
		comment: "Comment",
	};

	const headers = computed(() => {
		if (!columns.value.length) return defaultHeaders;

		const extraHeaders: {
			[key: string]: string;
		} = columns.value
			.map(column => Object.keys(column))
			.flat()
			.filter((value, index, self) => self.indexOf(value) === index)
			.filter(key => !Object.keys(defaultHeaders).includes(key))
			.reduce(
				(
					obj: {
						[key: string]: string;
					},
					key
				) => {
					obj[key] = key;
					return obj;
				},
				{}
			);

		return {
			...defaultHeaders,
			...extraHeaders,
		};
	});

	const sorted = ref({
		column_name: "asc",
	} as Record<string, "asc" | "desc" | "none">);

	watch(
		headers,
		() => {
			const headerKeys = Object.keys(headers.value);
			const newSorted = {} as Record<string, "asc" | "desc" | "none">;
			for (const headerKey of headerKeys) {
				if (!sorted.value[headerKey]) newSorted[headerKey] = "none";
				else newSorted[headerKey] = sorted.value[headerKey];
			}
			sorted.value = newSorted;
		},
		{ immediate: true }
	);

	function changeSort(header: string) {
		if (sorted.value[header] === "none") sorted.value[header] = "asc";
		else if (sorted.value[header] === "asc") sorted.value[header] = "desc";
		else if (sorted.value[header] === "desc") sorted.value[header] = "none";

		for (const [key, value] of Object.entries(sorted.value)) if (key !== header && value !== "none") sorted.value[key] = "none";

		const allNone = Object.values(sorted.value).every(value => value === "none");
		if (allNone) sorted.value["column_name"] = "asc";
	}

	const sortedColumns = computed(() => {
		return columns.value.sort(sortColumns);
	});

	function sortColumns(a: Record<string, any>, b: Record<string, any>) {
		for (const [key, value] of Object.entries(sorted.value)) {
			if (value === "none") continue;
			if (value === "asc") {
				if ((a[key]?.toString() ?? "") < (b[key]?.toString() ?? "")) return -1;
				if ((a[key]?.toString() ?? "") > (b[key]?.toString() ?? "")) return 1;
			} else if (value === "desc") {
				if ((a[key]?.toString() ?? "") > (b[key]?.toString() ?? "")) return -1;
				if ((a[key]?.toString() ?? "") < (b[key]?.toString() ?? "")) return 1;
			}
		}
		return 0;
	}
</script>

<template>
	<div class="scrolls" w-full h-full>
		<table min-w-full max-h-full>
			<thead text-left>
				<tr>
					<th v-for="[header, text] in Object.entries(headers)" :key="header" @click="changeSort(header)" px-2 border="1 base" cursor-pointer select-none>
						<div flex items-center>
							<span v-text="text" />
							<div ml-1>
								<div v-if="sorted[header] === 'desc'" i-carbon-chevron-sort-down class="text-icon" />
								<div v-else-if="sorted[header] === 'asc'" i-carbon-chevron-sort-up class="text-icon" />
								<div v-else i-carbon-chevron-sort class="text-icon" />
							</div>
						</div>
					</th>
				</tr>
			</thead>
			<tbody font-light>
				<tr v-for="column in sortedColumns" :key="column.column_name" class="tr-bg">
					<td v-for="header in Object.keys(headers)" :key="header" px-2 bg-base border="1 base" border-style-dashed op-80>
						<span>{{ column[header] ?? "" }}</span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss">
	html.dark .tr-bg:nth-child(odd) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	html:not(.dark) .tr-bg:nth-child(odd) {
		background-color: rgba(0, 0, 0, 0.05);
	}
</style>
