/* eslint-disable no-console */
import { cosmiconfig } from "cosmiconfig";
import TypeScriptLoader from "cosmiconfig-typescript-loader";
import { writeFileSync } from "fs";
import { join } from "path";

import type { Config } from "../types/interfaces/Config";
import { DEFAULT_CONFIG, zConfig } from "../types/interfaces/Config";
import type { Connection } from "../types/interfaces/Connection";
import { g, r, y } from "../util/chalk";
import { LOGGER, MODULE_NAME } from "../util/constants";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader";
import { getNewConfigFile } from "../util/functions/getters/getNewConfigFile";

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
		const envVar = process.env[this.config.connectionStringEnvironmentVariable];
		if (envVar) return [envVar];
		if (Array.isArray(this.config.connections)) return this.config.connections;
		return [this.config.connections];
	}
}
