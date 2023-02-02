import type { FileExport } from "../interfaces/FileExport";

export interface FileContext {
	getImport: (fileExport: FileExport) => string;
	addStringImport: (importString: string) => void;
}
