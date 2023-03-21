import type { Argument } from "../types/interfaces/Argument.js";

export const DebugOnly: Argument = {
	name: "debug-only",
	description: "Only prints out debug information when running the program,\ndoes not write any files (except the debug file itself)",
	type: Boolean,
	run: error => void error,
};
