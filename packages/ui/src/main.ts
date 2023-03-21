import "codemirror/lib/codemirror.css";
import "codemirror-theme-vars/base.css";
import "./assets/main.css";
import "@unocss/reset/tailwind.css";
import "splitpanes/dist/splitpanes.css";
import "floating-vue/dist/style.css";
import "uno.css";

import FloatingVue, { VTooltip } from "floating-vue";

import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);

FloatingVue.options.instantMove = true;
FloatingVue.options.distance = 10;

app.directive("tooltip", VTooltip);

app.mount("#app");
