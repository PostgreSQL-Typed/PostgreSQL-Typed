<script setup lang="ts">
	import { hasData, setData } from "@/composables/data";
	import { initNavigation } from "@/composables/navigation";
	import ky from "ky";

	async function fetchData() {
		setData(await ky("/fetchedData.json").json());
		initNavigation();
	}
</script>

<template>
	<template v-if="!hasData">
		<div fixed inset-0 p2 z-10 select-none text="center sm" bg="overlay" backdrop-blur-sm backdrop-saturate-0 @click="fetchData()">
			<div h-full flex="~ col gap-2" items-center justify-center class="animate-pulse">
				<div text="5xl" class="i-carbon:renew animate-spin animate-reverse" />
				<div text-2xl>No Data</div>
				<div text-lg op50>Check your terminal or make a new build with `pgt --ui`</div>
			</div>
		</div>
	</template>
</template>
