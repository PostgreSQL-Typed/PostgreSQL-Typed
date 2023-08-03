import type { Argument } from "../types/interfaces/Argument.js";

export const DebugOnly: Argument = {
	description: "Only prints out debug information when running the program,\ndoes not write any files (except the debug file itself)",
	name: "debug-only",
	run: error => void error,
	type: Boolean,
};
