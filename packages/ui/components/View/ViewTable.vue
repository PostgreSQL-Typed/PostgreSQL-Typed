<script setup lang="ts">
	import { activeTableClass } from "@/composables/data";
	import { parseColumnComment } from "@/util/functions";

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const columns = computed((): Record<string, any>[] => {
			return (activeTableClass.value?.attributes || []).map(attribute => {
				if (!attribute.comment) {
					return {
						column_default: attribute.default,
						column_name: attribute.attribute_name,
						comment: "",
						data_type: attribute.type_name,
						is_nullable: !attribute.not_null,
					};
				}

				const parsedComment = parseColumnComment(attribute.comment);

				return {
					column_default: attribute.default,
					column_name: attribute.attribute_name,
					comment: parsedComment.description,
					data_type: attribute.type_name,
					is_nullable: !attribute.not_null,
					...parsedComment.extraColumns,
				};
			});
		}),
		defaultHeaders = {
			column_default: "Default",
			column_name: "Column Name",
			comment: "Comment",
			data_type: "Data Type",
			is_nullable: "Nullable",
		},
		headers = computed(() => {
			if (columns.value.length === 0) return defaultHeaders;

			const extraHeaders: {
				[key: string]: string;
			} = columns.value
				.flatMap(column => Object.keys(column))
				.filter((value, index, self) => self.indexOf(value) === index)
				.filter(key => !Object.keys(defaultHeaders).includes(key))
				// eslint-disable-next-line unicorn/no-array-reduce
				.reduce(
					(
						object: {
							[key: string]: string;
						},
						key
					) => {
						object[key] = key;
						return object;
					},
					{}
				);

			return {
				...defaultHeaders,
				...extraHeaders,
			};
		}),
		sorted = ref({
			column_name: "asc",
		} as Record<string, "asc" | "desc" | "none">);

	watch(
		headers,
		() => {
			const headerKeys = Object.keys(headers.value),
				newSorted = {} as Record<string, "asc" | "desc" | "none">;
			for (const headerKey of headerKeys) newSorted[headerKey] = sorted.value[headerKey] ?? "none";

			sorted.value = newSorted;
		},
		{ immediate: true }
	);

	function changeSort(header: string) {
		switch (sorted.value[header]) {
			case "none":
				sorted.value[header] = "asc";
				break;

			case "asc":
				sorted.value[header] = "desc";
				break;

			case "desc":
				{
					sorted.value[header] = "none";
					// No default
				}
				break;
		}

		for (const [key, value] of Object.entries(sorted.value)) if (key !== header && value !== "none") sorted.value[key] = "none";

		const allNone = Object.values(sorted.value).every(value => value === "none");
		if (allNone) sorted.value.column_name = "asc";
	}

	const sortedColumns = computed(() => {
		return columns.value.sort(sortColumns);
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		<table id="dataTable" min-w-full max-h-full>
			<thead text-left>
				<tr>
					<th v-for="[header, text] in Object.entries(headers)" :key="header" px-2 border="1 base" cursor-pointer select-none @click="changeSort(header)">
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
