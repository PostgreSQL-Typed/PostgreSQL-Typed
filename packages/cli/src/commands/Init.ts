import { ConfigHandler } from "../classes/ConfigHandler.js";
import type { Command } from "../types/interfaces/Command.js";

export const Init: Command = {
	arguments: [],
	description: "Initialize the configuration file",
	name: "init",
	run: async () => {
		process.exit(await new ConfigHandler().initConfig());
	},
};
