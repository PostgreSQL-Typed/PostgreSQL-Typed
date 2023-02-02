import { ConfigHandler } from "../classes/ConfigHandler";
import type { Command } from "../types/interfaces/Command";

export const Init: Command = {
	name: "init",
	description: "Initialize the configuration file",
	arguments: [],
	run: async () => {
		process.exit(await new ConfigHandler().initConfig());
	},
};
