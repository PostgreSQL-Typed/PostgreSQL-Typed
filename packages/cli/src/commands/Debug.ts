import type { Argument } from "../types/interfaces/Argument.js";

export const Debug: Argument = {
	description: "Prints out debug information when running the program",
	name: "debug",
	run: error => void error,
	type: Boolean,
};
