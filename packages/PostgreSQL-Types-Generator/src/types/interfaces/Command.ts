import type { Argument } from "../interfaces/Argument";

export interface Command {
	name: string;
	description: string;
	arguments: Argument[];
	run: (...args: any) => void;
}
