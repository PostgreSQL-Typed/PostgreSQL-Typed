/* eslint-disable no-console */
import { writeFileSync } from "node:fs";

import { type Connection, DEFAULT_CONFIG_FILE, DEFAULT_CONFIG_FILE_RAW, loadPgTConfig, type PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";
import debug from "debug";
import { join, resolve } from "pathe";

import { g, y } from "../util/chalk.js";
import { GLOBAL_DEBUG_GLOB, LOGGER } from "../util/constants.js";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader.js";

export class ConfigHandler {
	filepath: string | null = null;
	config: PostgreSQLTypedCLIConfig = {} as PostgreSQLTypedCLIConfig;
	private LOGGER = LOGGER?.extend("ConfigHandler");

	public async loadConfig(): Promise<this> {
		this.LOGGER?.("Loading config file...");
		//TODO allow passing config file path
		const result = await loadPgTConfig();
		if (!result.configFile) {
			this.LOGGER?.("No config file found");
			return this;
		}

		this.LOGGER?.("Config file loaded");

		this.config = result.config.cli;
		if (this.config.types.debug) {
			debug.enable(GLOBAL_DEBUG_GLOB);
			this.LOGGER?.("Debug mode enabled at a later point, to enable it earlier, use the --debug flag");
		}
		return this;
	}

	public async initConfig(): Promise<0 | 1> {
		this.LOGGER?.("Initializing config file...");
		const result = await loadPgTConfig();
		if (result?.configFile && result?.cwd) {
			this.LOGGER?.("Config file already exists");
			console.log(
				getConsoleHeader(y("A configuration file is already present, skipping initialization..."), `File location: ${resolve(result.cwd, result.configFile)}`)
			);
			return 0;
		}

		try {
			const location = join(process.cwd(), DEFAULT_CONFIG_FILE);
			this.LOGGER?.("Writing config file to", location);
			writeFileSync(location, DEFAULT_CONFIG_FILE_RAW);
			console.log(getConsoleHeader(g("Successfully created configuration file!"), `File location: ${location}`));
			return 0;
		} catch (error) {
			console.error(error);
			return 1;
		}
	}

	get connections(): (string | Connection)[] {
		if (Array.isArray(this.config.connections)) return this.config.connections;
		return [this.config.connections];
	}
}
