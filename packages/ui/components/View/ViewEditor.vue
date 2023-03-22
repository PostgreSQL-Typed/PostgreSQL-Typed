<script setup lang="ts">
	import { activeTable, activeTableClass } from "@/composables/data";
	import { activeTableId } from "@/composables/navigation";
	import type CodeMirror from "codemirror";

	interface ParsedStack {
		method: string;
		file: string;
		line: number;
		column: number;
	}

	interface ErrorWithDiff extends Error {
		name: string;
		nameStr?: string;
		stack?: string;
		stackStr?: string;
		stacks?: ParsedStack[];
		showDiff?: boolean;
		actual?: any;
		expected?: any;
		operator?: string;
		type?: string;
		frame?: string;
	}

	const emit = defineEmits<{ (event: "draft", value: boolean): void }>();
	const code = ref("");
	const serverCode = shallowRef<string | undefined>(undefined);
	const draft = ref(false);
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
	const editor = ref<any>();
	const cm = computed<CodeMirror.EditorFromTextArea | undefined>(() => editor.value?.cm);
	const hasBeenEdited = ref(false);
	useResizeObserver(editor, () => {
		cm.value?.refresh();
	});

	function codemirrorChanges() {
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
			if (!cmValue) {
				return;
			}
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
