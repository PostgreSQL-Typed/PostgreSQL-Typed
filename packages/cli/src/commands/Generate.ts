import { resolve } from "node:path";

import { ConfigHandler } from "../classes/ConfigHandler.js";
import { Fetcher } from "../classes/Fetcher.js";
import { Printer } from "../classes/Printer.js";
import { ProgressBar } from "../classes/ProgressBar.js";
import type { Command } from "../types/interfaces/Command.js";
import { g, I, y } from "../util/chalk.js";
import { LOGGER, MODULE_NAME } from "../util/constants.js";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader.js";

export const Generate: Command = {
	name: "generate",
	description: "Generates the types",
	arguments: [],
	run: async (arguments_: Record<string, any>) => {
		const log = LOGGER.extend("Command").extend("Generate");
		log("Running command...");
		const configHandler = await new ConfigHandler().loadConfig(),
			{ connections, filepath, config } = configHandler,
			//fetches * steps in fetcher + steps in printer
			totalSteps = connections.length * 5 + 1,
			progressBar = new ProgressBar({
				progress: {
					line1: g("Fetching data"),
					spinnerColor: g,
					totalSteps,
					steps: ["Fetching tables", "Fetching data types", "Fetching classes", "Fetching attributes", "Fetching constraints", "Writing to files"],
				},
				waiter: {
					line1: connections.length > 1 ? g(`Connecting to ${connections.length} databases`) : g("Connecting to the database"),
					line2: filepath ? `Using configuration file: ${filepath}` : y("No configuration file found! Using default configuration."),
					line3: filepath ? "" : I(`You can run \`${MODULE_NAME} init\` to create a configuration file.`),
					spinnerColor: g,
				},
			});

		progressBar.startWaiter();

		let promises: Promise<void>[] = [];
		const fetchers: Fetcher[] = [];

		log("Connecting to database(s)...");
		for (const connection of connections) {
			const fetcher = new Fetcher(config, progressBar, connection);
			fetchers.push(fetcher);
			promises.push(fetcher.connect());
		}

		await Promise.all(promises);
		promises = [];
		log("Connected to database(s)!");

		progressBar.startProgress();

		log("Fetching data...");
		log("Fetching tables...");
		progressBar.setStep(0);
		await Promise.all(fetchers.map(f => f.fetchTables()));
		log("Fetching data types...");
		progressBar.setStep(1);
		await Promise.all(fetchers.map(f => f.fetchDataTypes()));
		log("Fetching classes...");
		progressBar.setStep(2);
		await Promise.all(fetchers.map(f => f.fetchClasses()));
		log("Fetching attributes...");
		progressBar.setStep(3);
		await Promise.all(fetchers.map(f => f.fetchAttributes()));
		log("Fetching constraints...");
		progressBar.setStep(4);
		await Promise.all(fetchers.map(f => f.fetchConstraints()));
		log("Fetched data!");

		progressBar.setStep(5);
		const printer = new Printer(
			config,
			fetchers.map(f => f.fetchedData),
			arguments_
		);

		log("Printing types...");
		progressBar.setProgressLine1(g("Generating types"));
		await printer.print();
		log("Printed types!");
		progressBar.incrementProgress();

		log("Disconnecting from database(s)...");
		progressBar.setProgressLine1(g("Finalizing"));

		for (const fetcher of fetchers) promises.push(fetcher.disconnect());

		await Promise.all(promises);
		promises = [];

		log("Disconnected from database(s)!");
		progressBar.stop();

		// eslint-disable-next-line no-console
		console.log(
			getConsoleHeader(
				g("Finished generating types!"),
				I("You can find the generated files in the following output directory:"),
				false,
				I(resolve(config.types.directory))
			)
		);
		process.exit(0);
	},
};
