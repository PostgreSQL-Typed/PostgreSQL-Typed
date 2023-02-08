import clArgs from "command-line-args";
import clCommands from "command-line-commands";
import debug from "debug";

import { Debug } from "../commands/Debug.js";
import { commands, DEFAULT_COMMAND, globalArugments, priorityArguments } from "../commands/index.js";
import type { Argument } from "../types/interfaces/Argument.js";
import type { Command } from "../types/interfaces/Command.js";
import { GLOBAL_DEBUG_GLOB, LOGGER } from "../util/constants.js";

export class CommandsHandler {
	// eslint-disable-next-line no-undefined
	private selectedCommand: Command | Argument | undefined = undefined;
	private parsedArguments: Record<string, any> = {};
	private LOGGER = LOGGER.extend("CommandsHandler");

	constructor() {
		let arguments_ = process.argv.slice(2);

		if (arguments_.includes(`--${Debug.name}`)) debug.enable(GLOBAL_DEBUG_GLOB);

		if (arguments_.length > 0 && !arguments_[0].includes("-")) {
			try {
				const parsedCommand = clCommands(
					commands.map(c => c.name),
					arguments_
				);
				this.selectedCommand = commands.find(c => c.name === parsedCommand.command);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.LOGGER(`Found command: ${this.selectedCommand!.name}`);
				arguments_ = parsedCommand.argv;
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
				argv: arguments_,
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
		for (const argument of Object.keys(this.parsedArguments)) {
			if (priorityArguments.map(a => a.name).includes(argument)) {
				this.LOGGER(`Found priority argument: ${argument}`);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return priorityArguments.find(a => a.name === argument)!.run(this.parsedArguments[argument], this.selectedCommand);
			}
		}

		if (this.selectedCommand) {
			this.LOGGER(`Running command: ${this.selectedCommand.name}`);
			this.selectedCommand.run(this.parsedArguments);
		} else this.runArgument();
	}

	private runArgument() {
		for (const argument of globalArugments) {
			if (argument.name in this.parsedArguments) {
				this.LOGGER(`Found global argument: ${argument.name}`);
				return argument.run(this.parsedArguments[argument.name]);
			}
		}
		this.LOGGER("No argument found... running default command");
		return DEFAULT_COMMAND.run(this.parsedArguments);
	}
}
