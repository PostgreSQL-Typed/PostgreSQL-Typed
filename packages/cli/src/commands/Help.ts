import type { Section } from "command-line-usage";
import commandLineUsage from "command-line-usage";

import { commands, globalArugments } from "../commands/index.js";
import type { Argument } from "../types/interfaces/Argument.js";
import type { Command } from "../types/interfaces/Command.js";
import { DESCRIPTION, LOGGER as logger, MODULE_NAME } from "../util/constants.js";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader.js";

export const Help: Argument = {
	name: "help",
	description: "Print out helpful usage information",
	type: Boolean,
	alias: "h",
	run: runner,
};

const LOGGER = logger.extend("HelpArgument");

function runner(_: unknown, command?: Command) {
	LOGGER("Running Help Argument");
	if (command) {
		LOGGER(`Printing help for command ${command.name}`);
		return commandHelp(command);
	}

	LOGGER("Printing help for all commands");
	const sections: Section[] = [
			{
				content: getConsoleHeader(DESCRIPTION, `Usage: \`${MODULE_NAME} <command> [options ...]\``, true),
				raw: true,
			},
			{
				header: "Available Commands",
				content: commands.map(c => ({
					name: c.name,
					summary: c.description,
				})),
			},
			{
				header: "Global Options",
				optionList: globalArugments,
			},
			{
				content: `Run \`${MODULE_NAME} <command> -h\` for help with a specific command.`,
				raw: true,
			},
		],
		usage = commandLineUsage(sections);
	// eslint-disable-next-line no-console
	console.log(usage);
	process.exit(0);
}

function commandHelp(command: Command) {
	const sections: Section[] = [
			{
				content: getConsoleHeader(DESCRIPTION, `Usage: \`${MODULE_NAME} ${command.name} [options ...]\``, true),
				raw: true,
			},
			{
				header: `${command.name} Options`,
				content: command.arguments.length > 0 ? command.arguments : "This command has no extra options.",
			},
			{
				header: "Global Options",
				optionList: globalArugments,
			},
		],
		usage = commandLineUsage(sections);
	// eslint-disable-next-line no-console
	console.log(usage);
	process.exit(0);
}
