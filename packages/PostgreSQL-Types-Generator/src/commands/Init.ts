import { ConfigHandler } from "../classes/ConfigHandler.js";
import type { Command } from "../types/interfaces/Command.js";

export const Init: Command = {
	name: "init",
	description: "Initialize the configuration file",
	arguments: [],
	run: async () => {
		process.exit(await new ConfigHandler().initConfig());
	},
};
