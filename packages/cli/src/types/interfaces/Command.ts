import type { Argument } from "../interfaces/Argument.js";

export interface Command {
	name: string;
	description: string;
	arguments: Argument[];
	run: (...arguments_: any) => void;
}
