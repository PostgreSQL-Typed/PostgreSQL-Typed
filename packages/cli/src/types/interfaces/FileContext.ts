import type { ImportStatement } from "@postgresql-typed/util";

import type { FileExport } from "../interfaces/FileExport.js";

export interface FileContext {
	getImport: (fileExport: FileExport) => string;
	addImportStatement: (importStatement: ImportStatement) => void;
}
