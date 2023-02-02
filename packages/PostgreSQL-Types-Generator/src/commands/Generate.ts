import { resolve } from "node:path";

import { ConfigHandler } from "../classes/ConfigHandler";
import { Fetcher } from "../classes/Fetcher";
import { Printer } from "../classes/Printer";
import { ProgressBar } from "../classes/ProgressBar";
import type { Command } from "../types/interfaces/Command";
import { g, I, y } from "../util/chalk";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader";

export const Generate: Command = {
	name: "generate",
	description: "Generates the types",
	arguments: [],
	run: async () => {
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
					line3: filepath ? "" : I("You can run `pgtg init` to create a configuration file."),
					spinnerColor: g,
				},
			});

		progressBar.startWaiter();

		let promises: Promise<void>[] = [];
		const fetchers: Fetcher[] = [];

		for (const connection of connections) {
			const fetcher = new Fetcher(config, progressBar, connection);
			fetchers.push(fetcher);
			promises.push(fetcher.connect());
		}

		await Promise.all(promises);
		promises = [];

		progressBar.startProgress();

		for (const fetcher of fetchers) promises.push(fetcher.fetch());

		await Promise.all(promises);
		promises = [];

		progressBar.setStep(5);
		const printer = new Printer(
			config,
			fetchers.map(f => f.fetchedData)
		);

		progressBar.setProgressLine1(g("Generating types"));
		await printer.print();
		progressBar.incrementProgress();

		progressBar.setProgressLine1(g("Finalizing"));

		for (const fetcher of fetchers) promises.push(fetcher.disconnect());

		await Promise.all(promises);
		promises = [];

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
