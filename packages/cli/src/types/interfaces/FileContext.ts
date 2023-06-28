import type { ImportStatement } from "@postgresql-typed/util";

import type { FileExport } from "../interfaces/FileExport.js";
import type { TypeId } from "../types/TypeId.js";

export interface FileContext {
	getImport: (fileExport: FileExport) => string;
	addImportStatement: (importStatement: ImportStatement) => void;
	getDeclarationName: (typeID: TypeId) => string;
	getRelativePath: (fileExport: FileExport) => string;
}
