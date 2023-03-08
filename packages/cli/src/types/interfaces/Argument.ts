export interface Argument {
	name: string;
	description: string;
	type: any;
	alias?: string;
	multiple?: boolean;
	required?: boolean;
	run: (...value: any) => void;
}
