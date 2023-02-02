import { FileContent } from "../classes/FileContent";
import type { Config } from "../types/interfaces/Config";
import type { FileContext } from "../types/interfaces/FileContext";
import type { FileExport } from "../types/interfaces/FileExport";
import type { FileName } from "../types/types/FileName";
import type { IdentifierName } from "../types/types/IdentifierName";
import type { TypeID } from "../types/types/TypeID";
import { mapGetOrSet } from "../util/functions/mapGetOrSet";
import { resolveFilename } from "../util/functions/resolveFileName";

export class PrinterContext {
	private readonly _files = new Map<FileName, FileContent>();
	private readonly _rawFiles = new Map<FileName, string>();

	constructor(public readonly config: Config) {}

	private _pushDeclaration(id: TypeID, mode: "type" | "value", declaration: (identifier: IdentifierName, imp: FileContext) => string[]): FileExport {
		const file = resolveFilename(this.config, id),
			fileContent = mapGetOrSet(this._files, file, () => new FileContent(this.config, file));

		return fileContent.pushDeclaration(id, mode, declaration);
	}

	public pushTypeDeclaration(id: TypeID, declaration: (identifier: IdentifierName, imp: FileContext) => string[]): FileExport {
		return this._pushDeclaration(id, "type", declaration);
	}
	public pushReExport(id: TypeID, from: FileExport): void {
		const file = resolveFilename(this.config, id),
			fileContent = mapGetOrSet(this._files, file, () => new FileContent(this.config, file));

		fileContent.pushReExport(id, from);
	}

	public pushValueDeclaration(id: TypeID, declaration: (identifier: IdentifierName, imp: FileContext) => string[]): FileExport {
		return this._pushDeclaration(id, "value", declaration);
	}

	public writeFile(filename: FileName, content: string) {
		if (this._rawFiles.has(filename)) throw new Error(`Cannot write the same file multiple times: ${filename}`);

		this._rawFiles.set(filename, content);
	}
	public getFiles() {
		return [
			...[...this._files.values()].map(file => ({
				filename: file.file,
				content: file.getContent(),
			})),
			...[...this._rawFiles].map(([filename, content]) => ({
				filename,
				content,
			})),
		];
	}
}
