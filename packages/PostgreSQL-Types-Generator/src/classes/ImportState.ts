import type { FileExport } from "../types/interfaces/FileExport";
import type { FileName } from "../types/types/FileName";

export class ImportState {
	public readonly file: FileName;
	private readonly _namedImports = new Map<string, FileExport>();
	constructor(file: FileName) {
		this.file = file;
	}
	public getImport(fileExport: FileExport): string {
		this._namedImports.set(fileExport.exportName, fileExport);
		return fileExport.exportName;
	}
	public getImportStatement(relativePath: string) {
		const namedImports = [...this._namedImports.values()].map(v => v.exportName);
		return `import { ${namedImports.sort().join(", ")} } from '${relativePath}';`;
	}
}
