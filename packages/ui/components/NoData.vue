<script setup lang="ts">
	import { errorMessage, fetchData, hasData, loading } from "@/composables/data";

	const loadingText = ref("Loading");
	let loadingInterval: NodeJS.Timer | undefined = setInterval(loadingMessage, 1000);

	watch(loading, value => {
		if (value) {
			loadingText.value = "Loading";
			loadingInterval = setInterval(loadingMessage, 1000);
		} else if (loadingInterval) {
			clearInterval(loadingInterval);
			loadingInterval = undefined;
		}
	});

	//* Alternate between loading loading. loading.. loading...
	function loadingMessage() {
		let loadingTextValue = loadingText.value;
		loadingTextValue += ".";
		loadingText.value = loadingTextValue.length > 10 ? "Loading" : loadingTextValue;
	}

	const title = computed(() => {
			if (loading.value) return loadingText.value;
			return "No Data";
		}),
		description = computed(() => {
			if (loading.value) return "Depending on the size of your database, this may take a while.";
			return errorMessage.value;
		}),
		subtitle = computed(() => {
			if (loading.value) return "Please wait";
			return "Click to refresh";
		});
</script>

<template>
	<template v-if="!hasData || loading">
		<div fixed inset-0 p2 z-10 select-none text="center sm" bg="overlay" backdrop-blur-sm backdrop-saturate-0 @click="fetchData()">
			<div h-full flex="~ col gap-2" items-center justify-center class="animate-pulse">
				<div text="5xl" class="i-carbon:renew animate-spin animate-reverse" />
				<div text-2xl>{{ title }}</div>
				<div text-lg op50>{{ description }}</div>
				<div text-sm op50>{{ subtitle }}</div>
			</div>
		</div>
	</template>
</template>
