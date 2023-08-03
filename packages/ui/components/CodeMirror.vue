<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<!-- eslint-disable func-call-spacing -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import type CodeMirror from "codemirror";
	import type { ModeSpec, ModeSpecOptions } from "codemirror";

	import { useCodeMirror } from "@/composables/codemirror";
	const properties = defineProps<{
			modelValue: string;
			mode?: string;
			readOnly?: boolean;
		}>(),
		attributes = useAttrs(),
		modeMap: Record<string, string | ModeSpec<ModeSpecOptions>> = {
			cjs: "javascript",
			cts: { name: "javascript", typescript: true },
			js: "javascript",
			jsx: { jsx: true, name: "javascript" } as any,
			mjs: "javascript",
			mts: { name: "javascript", typescript: true },
			ts: { name: "javascript", typescript: true },
			tsx: { jsx: true, name: "javascript", typescript: true } as any,
		},
		codeMirrorElement = ref<HTMLTextAreaElement>(),
		cm = shallowRef<CodeMirror.EditorFromTextArea>();

	defineExpose({ cm });

	const emit = defineEmits<{
		(event: "update:modelValue", value: string): void;
		(event: "save", content: string): void;
	}>();

	onMounted(async () => {
		cm.value = useCodeMirror(codeMirrorElement, input, {
			...properties,
			...attributes,
			extraKeys: {
				"Cmd-S"(cm) {
					emit("save", cm.getValue());
				},
				"Ctrl-S"(cm) {
					emit("save", cm.getValue());
				},
			},
			mode: modeMap[properties.mode || ""] || properties.mode,
			readOnly: properties.readOnly ? true : undefined,
		});
		cm.value.setSize("100%", "100%");
		cm.value.clearHistory();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		setTimeout(() => cm.value!.refresh(), 100);
	});

	const mode = computed(() => {
			const mode = modeMap[properties.mode || ""] || properties.mode;
			if (typeof mode === "string") return mode;
			return mode?.name;
		}),
		input = useVModel(properties, "modelValue", emit, { passive: true });
</script>

<template>
	<div relative font-mono text-sm class="codemirror-scrolls" :class="mode?.replace('/', '-')">
		<textarea ref="codeMirrorElement" />
	</div>
</template>
