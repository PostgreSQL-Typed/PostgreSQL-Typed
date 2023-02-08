/* eslint-disable no-console */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";

import type { Config } from "../types/interfaces/Config.js";
import { DEFAULT_CONFIG, zConfig } from "../types/interfaces/Config.js";
import type { Connection } from "../types/interfaces/Connection.js";
import { g, r, y } from "../util/chalk.js";
import { LOGGER, MODULE_NAME } from "../util/constants.js";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader.js";
import { getNewConfigFile } from "../util/functions/getters/getNewConfigFile.js";

export class ConfigHandler {
	filepath: string | null = null;
	config: Config = DEFAULT_CONFIG;
	private LOGGER = LOGGER.extend("ConfigHandler");
	private cosmi = cosmiconfig(MODULE_NAME, {
		searchPlaces: [
			"package.json",
			`.${MODULE_NAME}rc`,
			`.${MODULE_NAME}rc.json`,
			`.${MODULE_NAME}rc.yaml`,
			`.${MODULE_NAME}rc.yml`,
			`.${MODULE_NAME}rc.js`,
			`.${MODULE_NAME}rc.ts`,
			`.${MODULE_NAME}rc.cjs`,
			`${MODULE_NAME}.config.js`,
			`${MODULE_NAME}.config.ts`,
			`${MODULE_NAME}.config.cjs`,
		],
		loaders: {
			".ts": TypeScriptLoader(),
		},
	});

	public async loadConfig(): Promise<this> {
		this.LOGGER("loadConfig");
		const config = await this.cosmi.search();
		if (!config || config.isEmpty) {
			this.LOGGER("No config file found");
			return this;
		}

		const parseResult = zConfig.safeParse(config.config);
		if (!parseResult.success) {
			this.LOGGER(`Config file is not valid ${JSON.stringify(parseResult.error.errors)}`);
			const error = parseResult.error.errors[0];
			console.log(
				getConsoleHeader(
					r("Could not parse configuration file, please check your syntax!"),
					`Error message: ${error.message}`,
					false,
					`Error location: ${error.path.join(" -> ")}`
				)
			);
			process.exit(1);
		}
		this.LOGGER("Config file loaded");

		this.config = parseResult.data;
		this.filepath = config.filepath;
		return this;
	}

	public async initConfig(): Promise<0 | 1> {
		this.LOGGER("initConfig");
		const config = await this.cosmi.search();
		if (config && !config.isEmpty) {
			this.LOGGER("Config file already exists");
			console.log(getConsoleHeader(y("A configuration file is already present, skipping initialization..."), `File location: ${config.filepath}`));
			return 0;
		}

		try {
			const location = config?.filepath ?? join(process.cwd(), `${MODULE_NAME}.config.js`);
			this.LOGGER("Writing config file to", location);
			writeFileSync(location, getNewConfigFile(DEFAULT_CONFIG));
			console.log(getConsoleHeader(g("Successfully created configuration file!"), `File location: ${location}`));
			return 0;
		} catch (error) {
			console.error(error);
			return 1;
		}
	}

	get connections(): (string | Connection)[] {
		const environmentVariable = process.env[this.config.connectionStringEnvironmentVariable];
		if (environmentVariable) return [environmentVariable];
		if (Array.isArray(this.config.connections)) return this.config.connections;
		return [this.config.connections];
	}
}
