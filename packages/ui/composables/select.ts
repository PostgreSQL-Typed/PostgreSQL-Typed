import type { Ref } from "vue";

interface SelectOptions {
	el: Ref<HTMLElement | undefined>;
	onFocus?(): void;
	onBlur?(): void;
}

export const focusedElement = ref<HTMLElement>();

let active = false,
	listeners = 0;

export function useSelect(options: SelectOptions) {
	const focus = ref(false);

	if (typeof document !== "undefined") {
		!active && activateFocusTracking();

		listeners++;

		const unwatch = watch(focusedElement, element => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (element === options.el.value || options.el.value?.contains(element!)) {
				focus.value = true;
				options.onFocus?.();
			} else {
				focus.value = false;
				options.onBlur?.();
			}
		});

		onUnmounted(() => {
			unwatch();

			listeners--;

			if (!listeners) deactivateFocusTracking();
		});
	}

	return readonly(focus);
}

function activateFocusTracking() {
	document.addEventListener("focusin", handleFocusIn);
	active = true;
	focusedElement.value = document.activeElement as HTMLElement;
}

function deactivateFocusTracking() {
	document.removeEventListener("focusin", handleFocusIn);
}

function handleFocusIn() {
	focusedElement.value = document.activeElement as HTMLElement;
}
