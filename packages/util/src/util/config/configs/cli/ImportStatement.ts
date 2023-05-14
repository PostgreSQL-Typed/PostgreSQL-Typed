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

export function validateImportStatement(statement: Record<string, any>): ImportStatement | undefined {
	if (typeof statement !== "object") return undefined;
	if (typeof statement.module !== "string") return undefined;
	if (typeof statement.name !== "string") return undefined;
	if (statement.as && typeof statement.as !== "string") return undefined;
	if (!["default", "named"].includes(statement.type)) return undefined;
	if (statement.isType && typeof statement.isType !== "boolean") return undefined;

	return {
		module: statement.module,
		name: statement.name,
		as: statement.as ?? undefined,
		type: statement.type,
		isType: statement.isType ?? undefined,
	};
}
