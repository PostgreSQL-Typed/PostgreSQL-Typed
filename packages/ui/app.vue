<script lang="ts" setup>
	import { Pane, Splitpanes } from "splitpanes";

	import { fetchData } from "@/composables/data";
	import { dashboardVisible } from "@/composables/navigation";

	onMounted(async () => {
		fetchData();
	});

	const mainSizes = reactive([33, 67]),
		onMainResized = useDebounceFn((event: { size: number }[]) => {
			for (const [index, event_] of event.entries()) mainSizes[index] = event_.size;
		}, 0),
		resizeMain = () => {
			const width = window.innerWidth,
				panelWidth = Math.min(width / 3, 450);
			mainSizes[0] = (100 * panelWidth) / width;
			mainSizes[1] = 100 - mainSizes[0];
		};
</script>

<template>
	<ClientOnly>
		<div h-screen w-screen overflow="hidden">
			<Splitpanes @resized="onMainResized" @ready="resizeMain">
				<Pane min-size="20" :size="mainSizes[0]">
					<Navigation />
				</Pane>
				<Pane :size="mainSizes[1]">
					<transition>
						<Dashboard v-if="dashboardVisible" />
						<TableDetails v-else />
					</transition>
				</Pane>
			</Splitpanes>
		</div>
		<NoData />
	</ClientOnly>
</template>
