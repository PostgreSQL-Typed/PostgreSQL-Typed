<script lang="ts" setup>
	import { useSelect } from "@/composables/select";

	const properties = defineProps<{
			modelValue?: string;
			options: {
				database: string;
				hostPort: string;
				id: string;
			}[];
		}>(),
		// eslint-disable-next-line func-call-spacing
		emit = defineEmits<{
			(event: "update:modelValue", value: string): void;
		}>(),
		open = ref(false),
		element = ref<HTMLElement>();

	useSelect({ el: element, onBlur });

	function onBlur() {
		open.value = false;
	}

	function click(id: string) {
		emit("update:modelValue", id);
		open.value = false;
	}
</script>

<template>
	<div ref="element" class="selector" @mouseenter="open = true" @mouseleave="open = false">
		<button type="button" class="button" aria-haspopup="true" :aria-expanded="open" @click="open = !open">
			<span class="text">
				<slot name="selected" :item="modelValue" />
				<div i-carbon-chevron-down class="text-icon" />
			</span>
		</button>

		<div class="menu">
			<div class="menu-inner">
				<div v-for="option in properties.options" :key="option.id" class="button" @click="click(option.id)">
					<span v-if="option.id === modelValue" class="text" op20>
						<slot name="item" :item="option" />
					</span>
					<span v-else class="text">
						<slot name="item" :item="option" />
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.button[aria-expanded="true"] + .menu {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}
	.button {
		display: flex;
		align-items: center;
		padding: 0 12px;
	}
	.text {
		display: flex;
		align-items: center;
		cursor: pointer;
		position: relative;
	}
	.text-icon {
		width: 14px;
		height: 14px;
		fill: currentColor;
		position: absolute;
		right: -1rem;
	}
	.menu {
		position: absolute;
		right: 0;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.25s,
			visibility 0.25s,
			transform 0.25s;
		z-index: 1;
	}

	.menu-inner {
		border-radius: 12px;
		padding: 12px;
		min-width: 128px;
		border: 1px solid var(--vp-c-divider);
		background-color: var(--background-color);
		box-shadow:
			0 12px 32px rgba(0, 0, 0, 0.1),
			0 2px 6px rgba(0, 0, 0, 0.08);
		transition: background-color 0.5s;
		max-height: 200px;
		overflow-x: hidden;
		overflow-y: auto;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
