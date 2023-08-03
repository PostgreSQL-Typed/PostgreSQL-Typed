import "codemirror/addon/display/placeholder";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/sql/sql";
import "codemirror/mode/xml/xml";

import CodeMirror from "codemirror";
import type { Ref, WritableComputedRef } from "vue";
import { watch } from "vue";

export function useCodeMirror(
	textarea: Ref<HTMLTextAreaElement | null | undefined>,
	input: Ref<string> | WritableComputedRef<string>,
	options: CodeMirror.EditorConfiguration = {}
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const cm = CodeMirror.fromTextArea(textarea.value!, {
		theme: "vars",
		...options,
		scrollbarStyle: "simple",
	});

	let skip = false;

	cm.on("change", () => {
		if (skip) {
			skip = false;
			return;
		}
		input.value = cm.getValue();
	});

	watch(
		input,
		v => {
			if (v !== cm.getValue()) {
				skip = true;
				const selections = cm.listSelections();
				cm.replaceRange(v, cm.posFromIndex(0), cm.posFromIndex(Number.POSITIVE_INFINITY));
				cm.setSelections(selections);
			}
		},
		{ immediate: true }
	);

	return markRaw(cm);
}
