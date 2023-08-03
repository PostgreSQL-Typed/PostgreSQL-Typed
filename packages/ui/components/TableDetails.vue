<script setup lang="ts">
	import { activeTable, activeTableClass, database } from "@/composables/data";
	import { getERD } from "@/composables/diagram";
	import { getRelationGraph, type RelationGraph } from "@/composables/graph";
	import { activeTableId } from "@/composables/navigation";
	import { type Params, viewMode } from "@/composables/navigation";

	const graph = ref<RelationGraph>({ links: [], nodes: [] }),
		erd = ref(""),
		hasGraphBeenDisplayed = ref(false),
		hasDiagramBeenDisplayed = ref(false);
	debouncedWatch(
		activeTableId,
		async (c, o) => {
			if (c && c !== o) {
				graph.value = getRelationGraph();
				erd.value = getERD();
			}
		},
		{ debounce: 100, immediate: true }
	);
	const changeViewMode = (view: Params["view"]) => {
		if (view === "graph") hasGraphBeenDisplayed.value = true;
		if (view === "diagram") hasDiagramBeenDisplayed.value = true;
		viewMode.value = view;
	};

	onMounted(() => {
		changeViewMode(viewMode.value);
		graph.value = getRelationGraph();
		erd.value = getERD();
	});

	const comment = computed(() => {
			const c = activeTableClass.value?.comment;
			if (!c) return "";
			return ` • ${c}`;
		}),
		editorDraft = ref(false);

	function onDraft(value: boolean) {
		editorDraft.value = value;
	}
</script>

<template>
	<div v-if="activeTable" flex flex-col h-full max-h-full overflow-hidden>
		<div>
			<div p="2" h-10 flex="~ gap-2" items-center bg-header border="b base">
				<div flex-1 font-light op-50 ws-nowrap truncate text-sm>
					{{ database.database }} • {{ activeTable.schema_name }}.{{ activeTable.table_name }}{{ comment }}
				</div>
			</div>
			<div flex="~" items-center bg-header border="b-2 base" text-sm h-41px>
				<button id="tableBtn" tab-button :class="{ 'tab-button-active': viewMode === undefined }" @click="changeViewMode(undefined)">Table</button>
				<button id="graphBtn" tab-button :class="{ 'tab-button-active': viewMode === 'graph' }" @click="changeViewMode('graph')">Relation Graph</button>
				<button id="diagramBtn" tab-button :class="{ 'tab-button-active': viewMode === 'diagram' }" @click="changeViewMode('diagram')">ER Diagram</button>
				<button id="editorBtn" tab-button :class="{ 'tab-button-active': viewMode === 'editor' }" @click="changeViewMode('editor')">
					{{ editorDraft ? "*&#160;" : "" }}Editor
				</button>
			</div>
		</div>

		<div flex flex-col flex-1 overflow="hidden">
			<div v-if="hasGraphBeenDisplayed" v-show="viewMode === 'graph'" flex-1>
				<ViewGraph :graph="graph" />
			</div>
			<div v-if="hasDiagramBeenDisplayed" v-show="viewMode === 'diagram'" flex-1>
				<ViewDiagram :diagram="erd" />
			</div>
			<ViewEditor v-if="viewMode === 'editor'" @draft="onDraft" />
			<ViewTable v-if="!viewMode" />
		</div>
	</div>
</template>
