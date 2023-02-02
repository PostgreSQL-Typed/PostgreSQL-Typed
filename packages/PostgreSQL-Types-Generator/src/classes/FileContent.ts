import { dirname, relative } from "node:path";

import { ImportState } from "../classes/ImportState";
import type { Config } from "../types/interfaces/Config";
import type { FileContext } from "../types/interfaces/FileContext";
import type { FileExport } from "../types/interfaces/FileExport";
import type { FileName } from "../types/types/FileName";
import type { IdentifierName } from "../types/types/IdentifierName";
import type { TypeID } from "../types/types/TypeID";
import { resolveExportName } from "../util/functions/resolveExportName";

export class FileContent {
	public readonly file: FileName;
	private readonly _imports = new Map<FileName, ImportState>();
	private readonly _stringImports = new Set<string>();
	private readonly _declarationNames = new Set<string>();
	private readonly _declarations: (() => string[])[] = [];
	private readonly _reExports: {
		type: { source: string; dest: string }[];
		value: { source: string; dest: string }[];
	} = { type: [], value: [] };
	constructor(public readonly config: Config, file: FileName) {
		this.file = file;
	}

	private _getImportState(file: FileName): {
		getImport: (fileExport: FileExport) => string;
	} {
		if (file === this.file) {
			return {
				getImport: n => n.exportName,
			};
		}

		const cachedImportState = this._imports.get(file);
		if (typeof cachedImportState !== "undefined") return cachedImportState;

		const newImportState = new ImportState(file);
		this._imports.set(file, newImportState);
		return newImportState;
	}

	private _addStringImport(importString: string) {
		this._stringImports.add(importString);
	}

	public pushDeclaration(typeID: TypeID, mode: "type" | "value", declaration: (identifier: IdentifierName, imp: FileContext) => string[]): FileExport {
		const identifierName = resolveExportName(this.config, typeID);
		if (!this._declarationNames.has(identifierName)) {
			this._declarationNames.add(identifierName);
			const declarationLines = declaration(identifierName, {
				getImport: (id: FileExport) => this._getImportState(id.file).getImport(id),
				addStringImport: (importString: string) => this._addStringImport(importString),
			});

			this._declarations.push(() => [...declarationLines, `export ${mode === "type" ? "type " : ""}{${identifierName}}`]);
		}

		return {
			mode,
			file: this.file,
			hasPrimaryKey: this._declarations.some(line => line().some(l => l.startsWith("export const PrimaryKey"))),
			exportName: identifierName,
		};
	}
	public pushReExport(dest: TypeID, source: FileExport) {
		const identifierName = resolveExportName(this.config, dest);
		if (this._declarationNames.has(identifierName)) return;

		const importedName = this._getImportState(source.file).getImport(source);
		this._declarationNames.add(identifierName);
		this._reExports[source.mode].push({
			source: importedName,
			dest: identifierName,
		});
	}

	public getContent() {
		return `${[
			[...this._stringImports.values()].join("\n"),
			...(this._imports.size
				? [
						[...this._imports.values()]
							.sort((a, b) => (a.file < b.file ? -1 : 1))
							.map(imp => {
								const relativePath = relative(dirname(this.file), imp.file);
								return imp.getImportStatement(`${relativePath[0] === "." ? "" : "./"}${relativePath.replace(/(\.d)?\.tsx?$/, "").replaceAll("\\", "/")}`);
							})
							.join("\n"),
				  ]
				: []),
			...this._declarations.map(v => v().join("\n")),
			...(this._reExports.type.length
				? [`export type {\n${this._reExports.type.map(t => (t.source === t.dest ? `  ${t.source},` : `  ${t.source} as ${t.dest},`)).join("\n")}\n}`]
				: []),
			...(this._reExports.value.length
				? [`export {\n${this._reExports.value.map(t => (t.source === t.dest ? `  ${t.source},` : `  ${t.source} as ${t.dest},`)).join("\n")}\n}`]
				: []),
		].join("\n\n")}\n`;
	}
}
