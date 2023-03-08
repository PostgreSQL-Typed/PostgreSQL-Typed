import type { FileExport } from "../interfaces/FileExport.js";

export interface FileContext {
	getImport: (fileExport: FileExport) => string;
	addStringImport: (importString: string) => void;
}
