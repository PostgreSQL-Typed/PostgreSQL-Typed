import type { Argument } from "../types/interfaces/Argument.js";

export const Silent: Argument = {
	description: "Silences all output from the program",
	name: "silent",
	run: error => void error,
	type: Boolean,
};
