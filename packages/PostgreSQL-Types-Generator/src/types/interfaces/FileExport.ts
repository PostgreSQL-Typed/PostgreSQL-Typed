import type { FileName } from "../types/FileName.js";

export interface FileExport {
	mode: "type" | "value";
	file: FileName;
	hasPrimaryKey: boolean;
	exportName: string;
}
