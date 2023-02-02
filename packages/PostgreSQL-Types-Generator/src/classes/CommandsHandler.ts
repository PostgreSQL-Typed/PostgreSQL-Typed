import clArgs from "command-line-args";
import clCommands from "command-line-commands";
import debug from "debug";

import { commands, DEFAULT_COMMAND, globalArugments, priorityArguments } from "../commands";
import { Debug } from "../commands/Debug";
import type { Argument } from "../types/interfaces/Argument";
import type { Command } from "../types/interfaces/Command";
import { GLOBAL_DEBUG_GLOB, LOGGER } from "../util/constants";

export class CommandsHandler {
	// eslint-disable-next-line no-undefined
	private selectedCommand: Command | Argument | undefined = undefined;
	private parsedArguments: Record<string, any> = {};
	private LOGGER = LOGGER.extend("CommandsHandler");

	constructor() {
		let args = process.argv.slice(2);

		if (args.includes(`--${Debug.name}`)) debug.enable(GLOBAL_DEBUG_GLOB);

		if (args.length && !args[0].includes("-")) {
			try {
				const parsedCommand = clCommands(
					commands.map(c => c.name),
					args
				);
				this.selectedCommand = commands.find(c => c.name === parsedCommand.command);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.LOGGER(`Found command: ${this.selectedCommand!.name}`);
				args = parsedCommand.argv;
			} catch (error: any) {
				this.LOGGER(error);
				if (error.name === "INVALID_COMMAND") {
					this.selectedCommand = DEFAULT_COMMAND;
					this.runCommand();
				}
				throw error;
			}
		}

		try {
			this.parsedArguments = clArgs(globalArugments, {
				argv: args,
			});
			this.LOGGER(`Parsed global arguments: ${JSON.stringify(this.parsedArguments)}`);
		} catch (error: any) {
			this.LOGGER(error);
			if (error.name === "UNKNOWN_OPTION" || error.name === "INVALID_VALUE" || error.name === "UNKNOWN_VALUE") {
				this.selectedCommand = DEFAULT_COMMAND;
				this.runCommand();
			}
			throw error;
		}

		this.runCommand();
	}

	private runCommand() {
		for (const arg of Object.keys(this.parsedArguments)) {
			if (priorityArguments.map(a => a.name).includes(arg)) {
				this.LOGGER(`Found priority argument: ${arg}`);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return priorityArguments.find(a => a.name === arg)!.run(this.parsedArguments[arg], this.selectedCommand);
			}
		}

		if (this.selectedCommand) {
			this.LOGGER(`Running command: ${this.selectedCommand.name}`);
			this.selectedCommand.run(this.parsedArguments);
		} else this.runArgument();
	}

	private runArgument() {
		for (const arg of globalArugments) {
			if (arg.name in this.parsedArguments) {
				this.LOGGER(`Found global argument: ${arg.name}`);
				return arg.run(this.parsedArguments[arg.name]);
			}
		}
		this.LOGGER("No argument found... running default command");
		return DEFAULT_COMMAND.run(this.parsedArguments);
	}
}
