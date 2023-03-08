import type { FileExport } from "../interfaces/FileExport.js";
import type { ImportStatement } from "./ImportStatement.js";

export interface FileContext {
	getImport: (fileExport: FileExport) => string;
	addImportStatement: (importStatement: ImportStatement) => void;
}
