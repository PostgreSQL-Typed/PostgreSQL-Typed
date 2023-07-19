import type { Argument } from "../types/interfaces/Argument.js";

export const Silent: Argument = {
	name: "silent",
	description: "Silences all output from the program",
	type: Boolean,
	run: error => void error,
};
