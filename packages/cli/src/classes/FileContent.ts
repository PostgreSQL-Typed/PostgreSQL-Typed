import type { ImportStatement, PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";
import { dirname, relative } from "pathe";

import { ImportState } from "../classes/ImportState.js";
import type { FileContext } from "../types/interfaces/FileContext.js";
import type { FileExport } from "../types/interfaces/FileExport.js";
import type { FileName } from "../types/types/FileName.js";
import type { IdentifierName } from "../types/types/IdentifierName.js";
import type { TypeId } from "../types/types/TypeId.js";
import { resolveExportName } from "../util/functions/resolveExportName.js";

export class FileContent {
	public readonly file: FileName;
	private readonly _imports = new Map<FileName, ImportState>();
	private readonly _importStatements: ImportStatement[] = [];
	private readonly _declarationNames = new Set<string>();
	private readonly _declarations: (() => string[])[] = [];
	private readonly _reExports: {
		type: { source: string; dest: string }[];
		value: { source: string; dest: string }[];
	} = { type: [], value: [] };
	constructor(
		public readonly config: PostgreSQLTypedCLIConfig,
		file: FileName
	) {
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
		if (cachedImportState !== undefined) return cachedImportState;

		const newImportState = new ImportState(file);
		this._imports.set(file, newImportState);
		return newImportState;
	}

	private _addImportStatement(importStatement: ImportStatement) {
		if (
			this._importStatements.some(
				s =>
					s.module === importStatement.module &&
					s.name === importStatement.name &&
					s.as === importStatement.as &&
					s.type === importStatement.type &&
					s.isType === importStatement.isType
			)
		)
			return;
		this._importStatements.push(importStatement);
	}

	public pushDeclaration(typeID: TypeId, mode: "type" | "value", declaration: (identifier: IdentifierName, imp: FileContext) => string[]): FileExport {
		const identifierName = resolveExportName(this.config, typeID);
		if (!this._declarationNames.has(identifierName)) {
			this._declarationNames.add(identifierName);
			const declarationLines = declaration(identifierName, {
				addImportStatement: (importStatement: ImportStatement) => this._addImportStatement(importStatement),
				getDeclarationName: (id: TypeId) => resolveExportName(this.config, id),
				getImport: (id: FileExport) => this._getImportState(id.file).getImport(id),
				getRelativePath: (id: FileExport) => {
					const relativePath = relative(dirname(this.file), id.file);
					return `${relativePath[0] === "." ? "" : "./"}${relativePath.replace(/(\.d)?\.(t|j)sx?$/, "").replaceAll("\\", "/")}.js`;
				},
			});

			this._declarations.push(() => [...declarationLines, identifierName ? `export ${mode === "type" ? "type " : ""}{${identifierName}}` : ""]);
		}

		return {
			exportName: identifierName,
			file: this.file,
			hasPrimaryKey: this._declarations.some(line => line().some(l => l.startsWith("export const PrimaryKey"))),
			mode,
		};
	}
	public pushReExport(destination: TypeId, source: FileExport) {
		const identifierName = resolveExportName(this.config, destination);
		if (this._declarationNames.has(identifierName)) return;

		const importedName = this._getImportState(source.file).getImport(source);
		this._declarationNames.add(identifierName);
		this._reExports[source.mode].push({
			dest: identifierName,
			source: importedName,
		});
	}

	private _getImportStatements(): string {
		//* Group import statements by module
		const groupedImportStatements = new Map<string, ImportStatement[]>();
		for (const importStatement of this._importStatements) {
			const group = groupedImportStatements.get(importStatement.module);
			if (group === undefined) groupedImportStatements.set(importStatement.module, [importStatement]);
			else group.push(importStatement);
		}

		type ImportStatementGrouped = ImportStatement & {
			names: [string, boolean][];
		};
		const mergedImportStatements = new Map<string, ImportStatementGrouped[]>();

		//* For all import statements in a group, where the type is "named" and the names are the same (and they don't have an as), merge them into a single import statement
		for (const [module, group] of groupedImportStatements.entries()) {
			let newStatement: ImportStatementGrouped | undefined;
			for (const statement of group) {
				if (statement.type !== "named" || statement.as !== undefined) {
					const mergedGroup = mergedImportStatements.get(module);
					if (mergedGroup === undefined) {
						mergedImportStatements.set(module, [
							{
								...statement,
								names: [],
							},
						]);
					} else {
						mergedGroup.push({
							...statement,
							names: [],
						});
					}
				}

				if (newStatement === undefined) {
					newStatement = {
						...statement,
						isType: statement.isType ?? false,
						names: [[statement.name, statement.isType ?? false]],
					};
					continue;
				}

				const hasSameNameIndex = newStatement.names.findIndex(([name]) => name === statement.name);
				if (hasSameNameIndex === -1) newStatement.names.push([statement.name, statement.isType ?? false]);
				else {
					const sameName = newStatement.names[hasSameNameIndex];
					let isType = sameName[1];

					if (isType && !statement.isType) isType = false;

					newStatement.names[hasSameNameIndex] = [sameName[0], isType];
				}
			}

			if (newStatement === undefined) continue;

			//* If all the names in the statement are types, mark the statement as a type statement
			newStatement.isType = newStatement.names.every(([, isType]) => isType);

			const mergedGroup = mergedImportStatements.get(module);
			if (mergedGroup === undefined) mergedImportStatements.set(module, [newStatement]);
			else mergedGroup.push(newStatement);
		}

		//* Generate import statements
		const importStrings: string[] = [];
		for (const [module, group] of mergedImportStatements.entries()) {
			for (const statement of group) {
				if (statement.type === "default") importStrings.push(`import ${statement.as ?? statement.name} from "${module}";`);
				else if (statement.type === "named") {
					const names =
						statement.names
							.sort(([a], [b]) => a.localeCompare(b))
							.map(([name, isType]) => `${!statement.isType && isType ? "type " : ""}${name}`)
							.join(",\n  ") || statement.name;
					importStrings.push(
						`import${statement.isType ? " type" : ""} ${
							statement.as === undefined ? `{\n  ${names}\n}` : `{\n  ${names}\n} as ${statement.as}`
						} from "${module}";`
					);
				}
			}
		}

		return importStrings.join("\n");
	}

	public getContent() {
		return `${[
			this._getImportStatements(),
			...(this._imports.size > 0
				? [
						[...this._imports.values()]
							.sort((a, b) => (a.file < b.file ? -1 : 1))
							.map(imp => {
								const relativePath = relative(dirname(this.file), imp.file);
								return imp.getImportStatement(
									`${relativePath[0] === "." ? "" : "./"}${relativePath.replace(/(\.d)?\.(t|j)sx?$/, "").replaceAll("\\", "/")}.js`
								);
							})
							.join("\n"),
				  ]
				: []),
			...this._declarations.map(v => v().join("\n")),
			...(this._reExports.type.length > 0
				? [`export type {\n${this._reExports.type.map(t => (t.source === t.dest ? `  ${t.source},` : `  ${t.source} as ${t.dest},`)).join("\n")}\n}`]
				: []),
			...(this._reExports.value.length > 0
				? [`export {\n${this._reExports.value.map(t => (t.source === t.dest ? `  ${t.source},` : `  ${t.source} as ${t.dest},`)).join("\n")}\n}`]
				: []),
		].join("\n\n")}\n`;
	}
}
