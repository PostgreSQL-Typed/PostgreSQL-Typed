<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import "d3-graph-controller/default.css";

	import type { ResizeContext } from "d3-graph-controller";
	import { defineGraphConfig, GraphController, Markers, PositionInitializers } from "d3-graph-controller";

	import type { RelatinoGraphController, RelationGraph, RelationLink, RelationNode, RelationType } from "@/composables/graph";

	const properties = defineProps<{
			graph: RelationGraph;
		}>(),
		{ graph } = toRefs(properties),
		element = ref<HTMLDivElement>(),
		// const modalShow = ref(false)
		// const selectedModule = ref<string | null>()
		controller = ref<RelatinoGraphController | undefined>();

	// watchEffect(() => {
	//   if (modalShow.value === false)
	//     setTimeout(() => selectedModule.value = undefined, 300)
	// }, { flush: 'post' })

	onMounted(() => {
		resetGraphController();
	});

	onUnmounted(() => {
		controller.value?.shutdown();
	});

	watch(graph, resetGraphController);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function setFilter(name: RelationType, event: any) {
		controller.value?.filterNodesByType(event.target.checked, name);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function setShowLabels(event: any) {
		if (!controller.value) return;
		controller.value.showLinkLabels = event.target.checked;
	}

	function resetGraphController() {
		controller.value?.shutdown();
		if (!graph.value || !element.value) return;
		controller.value = new GraphController<RelationType, RelationNode, RelationLink>(
			element.value!,
			graph.value,
			// See https://graph-controller.yeger.eu/config/ for more options
			defineGraphConfig<RelationType, RelationNode, RelationLink>({
				autoResize: true,
				initial: {
					showLinkLabels: false,
				},
				marker: Markers.Arrow(2),
				nodeRadius: 10,
				// modifiers: {
				//   node: bindOnClick,
				// },
				positionInitializer: graph.value.nodes.length > 1 ? PositionInitializers.Randomized : PositionInitializers.Centered,

				simulation: {
					alphas: {
						initialize: 1,
						resize: ({ newHeight, newWidth }: ResizeContext) => {
							const willBeHidden = newHeight === 0 && newWidth === 0;
							if (willBeHidden) return 0;
							return 0.25;
						},
					},
					forces: {
						collision: {
							radiusMultiplier: 10,
						},
						link: {
							length: 240,
						},
					},
				},
				zoom: {
					max: 2,
					min: 0.5,
				},
			})
		);
	}

	function sortNodeTypes(a: RelationType, b: RelationType) {
		//* Sort order: root, incoming, outgoing, bidirectional
		if (a === "root") return -1;
		if (b === "root") return 1;
		if (a === "incoming") return -1;
		if (b === "incoming") return 1;
		if (a === "outgoing") return -1;
		if (b === "outgoing") return 1;
		if (a === "bidirectional") return -1;
		if (b === "bidirectional") return 1;
		return 0;
	}

	const showStarExplanation = computed(() => {
		//* If one of the links text includes "*", and showLinkLabels is true, show the explanation.
		if (!controller.value?.showLinkLabels) return false;
		return graph.value.links.some(link => link.label && link.label.text.includes("*"));
	});
</script>

<template>
	<div h-full min-h-75 flex-1 relative overflow="hidden">
		<div absolute top="0" left="0" w-full>
			<div flex items-center gap-4 px-3 py-2 relative>
				<div flex="~ gap-1" flex-col absolute top="0" py-2>
					<div v-for="node of controller?.nodeTypes.sort(sortNodeTypes)" :key="node" flex="~ gap-1" items-center select-none>
						<input
							v-if="node !== 'root'"
							:id="`type-${node}`"
							type="checkbox"
							:checked="controller?.nodeTypeFilter.includes(node)"
							@change="setFilter(node, $event)"
						/>
						<label
							font-light
							text-sm
							ws-nowrap
							overflow-hidden
							capitalize
							truncate
							:for="`type-${node}`"
							:class="`type-${node}`"
							border-b-2
							:style="{ 'border-color': `var(--color-node-${node})` }"
							>{{ node }}</label
						>
					</div>
				</div>
				<div flex-auto />
				<div flex="~ gap-1" items-center select-none>
					<input id="show-label" type="checkbox" :checked="controller?.showLinkLabels" @change="setShowLabels" />
					<label font-light text-sm ws-nowrap overflow-hidden capitalize truncate for="show-label">Show Column Labels</label>
				</div>
				<div>
					<IconButton id="resetController" v-tooltip.bottom="'Reset'" icon="i-carbon-reset" @click="resetGraphController" />
				</div>
			</div>
		</div>
		<div ref="element" />
		<div v-if="showStarExplanation" absolute bottom="0" right="3" py-2>
			<span text="xs" op20> * indicates that the relation is not set using Foreign Key constraints, but in a custom way. </span>
		</div>
		<!-- <Modal v-model="modalShow" direction="right">
      <template v-if="selectedModule">
        <Suspense>
          <ModuleTransformResultView :id="selectedModule" @close="modalShow = false" />
        </Suspense>
      </template>
    </Modal> -->
	</div>
</template>
<style>
	:root {
		--color-link-label: var(--color-text);
		--color-link: #ddd;
		--color-node-outgoing: #c0ad79;
		--color-node-incoming: #8bc4a0;
		--color-node-bidirectional: #f7cee2;
		--color-node-root: #6e9aa5;
		--color-node-label: var(--color-text);
		--color-node-stroke: var(--color-text);
	}
	html.dark {
		--color-text: #fff;
		--color-link: #333;
		--color-node-outgoing: #857a40;
		--color-node-incoming: #468b60;
		--color-node-bidirectional: #8b6e9a;
		--color-node-root: #467d8b;
	}
	.graph {
		/* The graph container is offset in its parent. Thus we can't use the default 100% height and have to subtract the offset. */
		height: calc(100% - 39px) !important;
	}
	.graph .node {
		stroke-width: 2px;
		stroke-opacity: 0.5;
	}
	.graph .link {
		stroke-width: 2px;
	}
	.graph .node:hover:not(.focused) {
		filter: none !important;
	}
	.graph .node__label {
		transform: translateY(20px);
		font-weight: 100;
		filter: brightness(0.5);
	}
	html.dark .graph .node__label {
		filter: brightness(1.2);
	}
	label.type-root {
		margin-left: 17px;
	}
</style>
