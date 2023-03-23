import type { Argument } from "../types/interfaces/Argument.js";
import { LOGGER, VERSION } from "../util/constants.js";

export const Version: Argument = {
	name: "version",
	description: "Prints the version of the program",
	type: Boolean,
	alias: "v",
	run: () => {
		LOGGER?.extend("Argument").extend("Version")("Printing version");
		// eslint-disable-next-line no-console
		console.log(`v${VERSION}`);
		process.exit(0);
	},
};
