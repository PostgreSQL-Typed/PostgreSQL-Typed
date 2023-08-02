import { createHash } from "node:crypto";
import { promises } from "node:fs";

import { OID } from "@postgresql-typed/oids";
import type { ImportStatement, PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";
import { sync } from "mkdirp";
import { dirname, join } from "pathe";

import { PrinterContext } from "../classes/PrinterContext.js";
import { DebugOnly } from "../commands/DebugOnly.js";
import { ClassKind } from "../types/enums/ClassKind.js";
import type { ClassDetails } from "../types/interfaces/ClassDetails.js";
import type { FetchedData } from "../types/interfaces/FetchedData.js";
import type { FileContext } from "../types/interfaces/FileContext.js";
import type { DataType } from "../types/types/DataType.js";
import { GENERATED_STATEMENT, LOGGER } from "../util/constants.js";
import { DefaultDefinerMappings } from "../util/DefaultDefinerMappings.js";
import { DefaultDefinerTypeMappings } from "../util/DefaultDefinerTypeMappings.js";
import { getDefiner } from "../util/functions/getters/getDefiner.js";
import { isDebugEnabled } from "../util/functions/isDebugEnabled.js";
import { printDatabaseReexport } from "../util/functions/printers/printDatabaseReexport.js";
import { resolveFilename } from "../util/functions/resolveFileName.js";

export class Printer {
	public readonly classes: Map<number, ClassDetails>;
	public readonly types: Map<number, DataType>;
	public readonly context: PrinterContext;
	private LOGGER = LOGGER?.extend("Printer");
	constructor(public readonly config: PostgreSQLTypedCLIConfig, readonly data: FetchedData[], readonly arguments_: Record<string, any>) {
		this.classes = new Map(
			data
				.flatMap(d => d.classes.filter(c => d.tables.map(t => `${t.schema_name}.${t.table_name}`).includes(`${c.schema_name}.${c.class_name}`)))
				.map(c => [c.class_id, c])
		);
		this.types = new Map(data.flatMap(d => d.types).map(t => [t.type_id, t]));

		this.context = new PrinterContext(this.config);
	}

	public getClass(id: number) {
		return this.classes.get(id);
	}

	private _getDefinerOverride(type: DataType): [string, ImportStatement[]] | null {
		return this.config.files.definerOverrides[`${type.schema_name}.${type.type_name}`] ?? this.config.files.definerOverrides[`${type.type_name}`] ?? null;
	}

	private _getDefinerTypeOverride(type: DataType): [string, ImportStatement[]] | null {
		return (
			this.config.files.definerTypeOverrides[`${type.schema_name}.${type.type_name}`] ?? this.config.files.definerTypeOverrides[`${type.type_name}`] ?? null
		);
	}

	public getDefiner(
		id: number,
		file: FileContext,
		info: {
			schemaName: string;
			tableName: string;
			columnName: string;
		}
	): string {
		const override =
			this.config.files.definerOverrides[`${info.schemaName}.${info.tableName}.${info.columnName}`] ||
			this.config.files.definerOverrides[`${info.tableName}.${info.columnName}`] ||
			this.config.files.definerOverrides[id];
		if (override !== undefined) {
			const [type, imports] = override;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}

		if (id in OID) {
			const string = OID[id],
				override = this.config.files.definerOverrides[string];

			if (override !== undefined) {
				const [type, imports] = override;
				for (const importStatement of imports) file.addImportStatement(importStatement);
				return type;
			}
		}

		const builtin = DefaultDefinerMappings.get(id);
		if (builtin !== undefined) {
			if (!Array.isArray(builtin)) return builtin;

			const [type, imports] = builtin;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}

		const type = this.types.get(id);
		if (!type) return "unknown";

		const globalOverride = this._getDefinerOverride(type);
		if (globalOverride !== null) {
			const [type, imports] = globalOverride;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}
		return getDefiner(type, this, file);
	}

	public getDefinerType(
		id: number,
		file: FileContext,
		info: {
			schemaName: string;
			tableName: string;
			columnName: string;
		}
	): string {
		const override =
			this.config.files.definerTypeOverrides[`${info.schemaName}.${info.tableName}.${info.columnName}`] ||
			this.config.files.definerTypeOverrides[`${info.tableName}.${info.columnName}`] ||
			this.config.files.definerTypeOverrides[id];
		if (override !== undefined) {
			const [type, imports] = override;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}

		if (id in OID) {
			const string = OID[id],
				override = this.config.files.definerTypeOverrides[string];

			if (override !== undefined) {
				const [type, imports] = override;
				for (const importStatement of imports) file.addImportStatement(importStatement);
				return type;
			}
		}

		const builtin = DefaultDefinerTypeMappings.get(id);
		if (builtin !== undefined) {
			if (!Array.isArray(builtin)) return builtin;

			const [type, imports] = builtin;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}

		const type = this.types.get(id);
		if (!type) return "unknown";

		const globalOverride = this._getDefinerTypeOverride(type);
		if (globalOverride !== null) {
			const [type, imports] = globalOverride;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}
		return getDefiner(type, this, file);
	}

	public async print() {
		const allClasses = [...this.classes.values()].filter(cls => cls.kind === ClassKind.OrdinaryTable),
			databaseClassLists: ClassDetails[][] = [];

		for (const cls of allClasses) {
			const classList = databaseClassLists.find(c => c[0].database_name === cls.database_name);
			if (classList) classList.push(cls);
			else databaseClassLists.push([cls]);
		}

		for (const classList of databaseClassLists) printDatabaseReexport(classList, this);

		return await this.writeFiles();
	}

	private async writeFiles() {
		const { directory, preCompile } = this.config.files,
			files = this.context.getFiles().sort((a, b) => a.filename.localeCompare(b.filename)),
			filenames = new Set(files.map(f => f.filename));

		//* Create directory if it doesn't exist
		sync(directory);

		if (this.arguments_[DebugOnly.name] !== true) {
			//* Delete files that would no longer be output
			const directoryFiles = await this.getAllFiles(directory),
				directoryFilesToDelete = directoryFiles
					.map(fileName => (fileName.startsWith(directory) ? fileName.slice(directory.length + 1) : fileName))
					.filter(fileName => !filenames.has(fileName));

			if (directoryFilesToDelete.length > 0) {
				this.LOGGER?.(`Deleting ${directoryFilesToDelete.length} files...`);
				const folders: string[] = [];
				await Promise.all(
					directoryFilesToDelete.map(async fileName => {
						const filePath = join(directory, fileName),
							file = await promises.stat(filePath);
						if (file.isFile()) {
							const source = await promises.readFile(filePath, "utf8");
							if (source.includes(GENERATED_STATEMENT)) {
								this.LOGGER?.(`Deleting: ${filePath}`);
								await promises.unlink(filePath);
							}
						} else if (file.isDirectory()) folders.push(filePath);
					})
				);

				//* Sort folders by length so that we delete the deepest ones first
				folders.sort((a, b) => b.length - a.length);

				//* Delete empty folders
				for (const folder of folders) {
					const files = await promises.readdir(folder);
					if (files.length === 0) {
						this.LOGGER?.(`Deleting folder: ${folder}`);
						await promises.rmdir(folder);
					}
				}
			} else this.LOGGER?.("No files to delete.");

			await Promise.all(
				files.map(async f => {
					const filename = join(directory, f.filename),
						extensionsToCheck = preCompile ? [".d.ts", ".js"] : [".ts"],
						shouldCheck = extensionsToCheck.some(extension => filename.endsWith(extension));
					if (shouldCheck) {
						const content = f.content.trim(),
							checksum = `Checksum: ${createHash("sha512").update(content).digest("base64")}`;

						try {
							const existingSource = await promises.readFile(filename, "utf8");
							if (existingSource.includes(checksum)) {
								this.LOGGER?.(`Skipping: ${filename} (unchanged)`);
								return;
							}
							this.LOGGER?.(`Updating: ${filename}`);
						} catch (error: any) {
							if (error.code !== "ENOENT") throw error;
							this.LOGGER?.(`Writing: ${filename}`);
						}

						//* Double check nested folders exist
						sync(dirname(filename));

						await promises.writeFile(
							filename,
							[
								"/**",
								" * !!! THIS FILE IS AUTOMATICALLY GENERATED, PLEASE DO NOT EDIT THIS FILE MANUALLY !!!",
								" *",
								` * ${GENERATED_STATEMENT}`,
								` * ${checksum}`,
								" */",
								"",
								//TODO add option to add custom comments
								"/* eslint-disable */",
								"// tslint:disable",
								"/* deepscan-disable */",
								"",
								content,
								"",
							].join("\n")
						);
					} else {
						try {
							const existingSource = await promises.readFile(filename, "utf8");
							if (existingSource === f.content) return;
							this.LOGGER?.(`Updating: ${f.filename}`);
						} catch (error: any) {
							if (error.code !== "ENOENT") throw error;
							this.LOGGER?.(`Writing: ${f.filename}`);
						}

						await promises.writeFile(filename, f.content);
					}
				})
			);
		}

		if (isDebugEnabled()) {
			this.LOGGER?.("Writing debug file...");
			//* Get the Date in UTC
			const debugFileName = resolveFilename(this.config, this.getDebugConfigType()),
				filePath = join(directory, debugFileName);
			this.LOGGER?.(`Writing: ${filePath}`);
			await promises.writeFile(filePath, JSON.stringify(this.data, null, 4));
		}
	}

	private async getAllFiles(directory: string): Promise<string[]> {
		const directoryFiles = await promises.readdir(directory),
			files: string[] = [];

		for (const fileName of directoryFiles) {
			const filePath = join(directory, fileName),
				file = await promises.stat(filePath);

			if (file.isDirectory()) {
				const newFiles = await this.getAllFiles(filePath);
				files.push(...newFiles, filePath);
			} else files.push(filePath);
		}

		return files;
	}

	private pad(number: number, length: number) {
		return number.toString().padStart(length, "0");
	}

	private getDebugConfigType() {
		const nowNonUTC = new Date(),
			now = new Date(
				nowNonUTC.getUTCFullYear(),
				nowNonUTC.getUTCMonth(),
				nowNonUTC.getUTCDate(),
				nowNonUTC.getUTCHours(),
				nowNonUTC.getUTCMinutes(),
				nowNonUTC.getUTCSeconds(),
				nowNonUTC.getUTCMilliseconds()
			);

		return {
			type: "debug" as const,
			date: `${this.pad(now.getFullYear(), 4)}-${this.pad(now.getMonth() + 1, 2)}-${this.pad(now.getDate(), 2)}`,
			time: `${this.pad(now.getHours(), 2)}-${this.pad(now.getMinutes(), 2)}-${this.pad(now.getSeconds(), 2)}.${this.pad(now.getMilliseconds(), 3)}`,
			timestamp: `${this.pad(now.getFullYear(), 4)}-${this.pad(now.getMonth() + 1, 2)}-${this.pad(now.getDate(), 2)}_${this.pad(now.getHours(), 2)}-${this.pad(
				now.getMinutes(),
				2
			)}-${this.pad(now.getSeconds(), 2)}.${this.pad(now.getMilliseconds(), 3)}`,
			year: this.pad(now.getFullYear(), 4),
			month: this.pad(now.getMonth() + 1, 2),
			day: this.pad(now.getDate(), 2),
			hour: this.pad(now.getHours(), 2),
			minute: this.pad(now.getMinutes(), 2),
			second: this.pad(now.getSeconds(), 2),
			millisecond: this.pad(now.getMilliseconds(), 3),
		};
	}
}
