import type { Argument } from "../types/interfaces/Argument.js";
import { LOGGER, VERSION } from "../util/constants.js";

export const Version: Argument = {
	alias: "v",
	description: "Prints the version of the program",
	name: "version",
	run: () => {
		LOGGER?.extend("Argument").extend("Version")("Printing version");
		// eslint-disable-next-line no-console
		console.log(`v${VERSION}`);
		process.exit(0);
	},
	type: Boolean,
};
