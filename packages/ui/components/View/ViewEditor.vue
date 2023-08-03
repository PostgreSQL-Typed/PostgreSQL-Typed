<!-- eslint-disable func-call-spacing -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
	import type CodeMirror from "codemirror";

	import { activeTable, activeTableClass } from "@/composables/data";
	import { activeTableId } from "@/composables/navigation";

	const emit = defineEmits<{ (event: "draft", value: boolean): void }>(),
		code = ref(""),
		serverCode = shallowRef<string | undefined>(),
		draft = ref(false);
	watch(
		activeTableId,
		async () => {
			if (!activeTableId.value || !activeTable.value || !activeTableClass.value) {
				code.value = "";
				serverCode.value = code.value;
				draft.value = false;
				return;
			}

			code.value = `/* Table */\n\nCOMMENT ON\nTABLE\n\t${activeTable.value.schema_name}.${activeTable.value.table_name}\nIS '${
				activeTableClass.value.comment ?? ""
			}';\n\n\n/* Columns */${activeTableClass.value.attributes
				.map(
					attribute =>
						`\n\nCOMMENT ON\nCOLUMN\n\t${attribute.schema_name}.${attribute.class_name}.${attribute.attribute_name}\nIS '${attribute.comment ?? ""}';`
				)
				.join("")}`;
			serverCode.value = code.value;
			draft.value = false;
		},
		{ immediate: true }
	);

	const editor = ref<any>(),
		cm = computed<CodeMirror.EditorFromTextArea | undefined>(() => editor.value?.cm),
		hasBeenEdited = ref(false);
	useResizeObserver(editor, () => {
		cm.value?.refresh();
	});

	function codemirrorChanges() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		draft.value = serverCode.value !== cm.value!.getValue();
	}

	watch(
		draft,
		d => {
			emit("draft", d);
		},
		{ immediate: true }
	);

	watch(
		cm,
		cmValue => {
			if (!cmValue) return;

			setTimeout(() => {
				cmValue.on("changes", codemirrorChanges);
				if (!hasBeenEdited.value) cmValue.clearHistory(); // Prevent getting access to initial state
			}, 100);
		},
		{ flush: "post" }
	);

	async function onSave(content: string) {
		hasBeenEdited.value = true;
		//TODO Run the SQL and update the results
		serverCode.value = content;
		draft.value = false;
	}
</script>

<template>
	<CodeMirror ref="editor" v-model="code" h-full v-bind="{ lineNumbers: true }" mode="text/x-pgsql" @save="onSave" />
</template>
