import type { Argument } from "../types/interfaces/Argument.js";

export const Debug: Argument = {
	name: "debug",
	description: "Prints out debug information when running the program",
	type: Boolean,
	run: error => void error,
};
