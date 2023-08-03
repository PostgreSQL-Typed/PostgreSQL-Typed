/* eslint-disable unicorn/filename-case */
import "floating-vue/dist/style.css";

import FloatingVue from "floating-vue";

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.use(FloatingVue);
});
