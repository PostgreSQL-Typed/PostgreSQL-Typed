import { z } from "zod";

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

export const zImportStatement = z.object({
	module: z.string(),
	name: z.string(),
	as: z.string().optional(),
	type: z.union([z.literal("default"), z.literal("named")]),
	isType: z.boolean().optional(),
});
