export interface ImportStatement {
	// The name of the module to import from.
	module: string;
	// The name of the import.
	name: string;
	// The name of the import as it will be used in the code.
	as?: string;
	// The type of the import.
	type: "default" | "named";
	// Whether the import is a type import.
	isType?: boolean;
}
