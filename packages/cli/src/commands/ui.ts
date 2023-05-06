import { fork } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path/posix";

import type { Command } from "../types/interfaces/Command.js";
import { g, I, r } from "../util/chalk.js";
import { LOGGER as logger, UI_PACKAGE } from "../util/constants.js";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader.js";

const LOGGER = logger?.extend("Command").extend("UI");

export const UI: Command = {
	name: "ui",
	description: "Visualize your PostgreSQL database",
	arguments: [],
	run: async () => {
		LOGGER?.("Running UI Command");

		const ui = resolve(process.cwd(), `node_modules/${UI_PACKAGE}/.output/server/index.mjs`);
		if (!existsSync(ui)) {
			// eslint-disable-next-line no-console
			return console.log(getConsoleHeader(r(`Could not find the ${UI_PACKAGE} package.`), "Please make sure you have installed the package and try again."));
		}

		const uiProcess = fork(ui, [], { stdio: "pipe" });
		uiProcess.stderr?.on("data", (data: Buffer) => {
			// eslint-disable-next-line no-console
			console.log(
				getConsoleHeader(
					r("An error occurred while starting the UI."),
					I(data.toString().split("Error: ")[1].trim()),
					false,
					I("If the error persists, please open an issue on GitHub.")
				)
			);
		});
		uiProcess.stdout?.on("data", (data: Buffer) => {
			if (data.toString().startsWith("Listening")) {
				// eslint-disable-next-line no-console
				console.log(
					getConsoleHeader(
						g(`Successfully started the UI on ${data.toString().split("Listening").pop()?.trim() ?? "localhost:3000"}`),
						I("You can change the port by setting the NUXT_PORT environment variable.")
					)
				);
			}
		});
	},
};
