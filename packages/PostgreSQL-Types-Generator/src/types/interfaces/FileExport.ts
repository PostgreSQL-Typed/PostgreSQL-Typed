import type { FileName } from "../types/FileName";

export interface FileExport {
	mode: "type" | "value";
	file: FileName;
	hasPrimaryKey: boolean;
	exportName: string;
}
