<script setup lang="ts">
	import type { MermaidConfig } from "mermaid";
	import mermaid from "mermaid";

	const el = ref<HTMLElement>();

	onMounted(() => {
		mermaid.initialize({
			startOnLoad: false,
			...options.value,
		});
		mermaid.run();
	});

	watch(
		() => props.diagram,
		async () => {
			el.value?.removeAttribute("data-processed");
			await nextTick();
			mermaid.initialize({
				startOnLoad: false,
				...options.value,
			});
			mermaid.run();
		}
	);

	const props = defineProps<{
		diagram: string;
	}>();

	const options = computed(
		(): MermaidConfig => ({
			fontFamily: "Readex Pro, sans-serif",
		})
	);
</script>

<template>
	<div h-full min-h-75 flex-1 relative overflow="hidden">
		<pre class="mermaid" ref="el">{{ props.diagram }}</pre>
	</div>
</template>

<style lang="scss">
	.mermaid {
		width: 100%;
		height: 100%;

		svg {
			margin: auto;
			height: 100%;
		}
	}

	html.dark {
		.mermaid {
			.relationshipLabelBox {
				background-color: none !important;
				fill: unset !important;
				opacity: 0 !important;
			}

			.relationshipLabel {
				fill: white !important;
			}

			.relationshipLine {
				stroke: var(--color-link) !important;
			}

			marker path {
				stroke: var(--color-link) !important;
			}

			marker circle {
				fill: var(--color-link) !important;
			}
		}
	}
</style>
