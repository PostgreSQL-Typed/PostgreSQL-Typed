import type { Argument } from "../types/interfaces/Argument";
import { LOGGER, VERSION } from "../util/constants";

export const Version: Argument = {
	name: "version",
	description: "Prints the version of the program",
	type: Boolean,
	alias: "v",
	run: () => {
		LOGGER.extend("VersionArgument")("Printing version");
		// eslint-disable-next-line no-console
		console.log(`v${VERSION}`);
		process.exit(0);
	},
};
