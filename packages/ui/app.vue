<script lang="ts" setup>
	import ky from "ky";
	import { Pane, Splitpanes } from "splitpanes";
	import { dashboardVisible, initNavigation } from "@/composables/navigation";
	import { setData } from "@/composables/data";

	onMounted(async () => {
		setData(await ky("/fetchedData.json").json());
		initNavigation();
	});

	const mainSizes = reactive([33, 67]);

	const onMainResized = useDebounceFn((event: { size: number }[]) => {
		event.forEach((e, i) => {
			mainSizes[i] = e.size;
		});
	}, 0);

	const resizeMain = () => {
		const width = window.innerWidth;
		const panelWidth = Math.min(width / 3, 450);
		mainSizes[0] = (100 * panelWidth) / width;
		mainSizes[1] = 100 - mainSizes[0];
	};
</script>

<template>
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
</template>
