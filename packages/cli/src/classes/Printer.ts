import { createHash } from "node:crypto";
import { promises } from "node:fs";
import { dirname, join } from "node:path";

import { OID } from "@postgresql-typed/oids";
import mkdirp from "mkdirp";

import { PrinterContext } from "../classes/PrinterContext.js";
import { ClassKind } from "../types/enums/ClassKind.js";
import type { ClassDetails } from "../types/interfaces/ClassDetails.js";
import type { Config } from "../types/interfaces/Config.js";
import type { FetchedData } from "../types/interfaces/FetchedData.js";
import type { FileContext } from "../types/interfaces/FileContext.js";
import type { ImportStatement } from "../types/interfaces/ImportStatement.js";
import type { DataType } from "../types/types/DataType.js";
import { GENERATED_STATEMENT, LOGGER } from "../util/constants.js";
import { DefaultParserMapping } from "../util/DefaultParserMapping.js";
import { DefaultTypeScriptMapping } from "../util/DefaultTypeScriptMapping.js";
import { getParserType } from "../util/functions/getters/getParserType.js";
import { getTypeScriptType } from "../util/functions/getters/getTypeScriptType.js";
import { printAllDetails } from "../util/functions/printers/printAllDetails.js";

export class Printer {
	public readonly classes: Map<number, ClassDetails>;
	public readonly types: Map<number, DataType>;
	public readonly context: PrinterContext;
	private LOGGER = LOGGER.extend("Printer");
	constructor(public readonly config: Config, readonly data: FetchedData[]) {
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

	private _getTypeOverride(type: DataType): string | null {
		return this.config.types.typeOverrides[`${type.schema_name}.${type.type_name}`] ?? this.config.types.typeOverrides[`${type.type_name}`] ?? null;
	}

	public getTypeScriptType(id: number, file: FileContext, maxLength?: number): string {
		const override = this.config.types.typeOverrides[id];
		if (override !== undefined) return override;

		if (id in OID) {
			const string = OID[id],
				override = this.config.types.typeOverrides[string];

			if (override !== undefined) return override;
		}

		const builtin = DefaultTypeScriptMapping.get(id, maxLength);
		if (builtin !== undefined) {
			if (!Array.isArray(builtin)) return builtin;

			const [type, imports] = builtin;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}

		const type = this.types.get(id);
		if (!type) return "unknown";
		return this._getTypeOverride(type) ?? getTypeScriptType(type, this, file, maxLength);
	}

	private _getParserOverride(type: DataType): [string, ImportStatement[]] | null {
		return this.config.types.parserOverrides[`${type.schema_name}.${type.type_name}`] ?? this.config.types.parserOverrides[`${type.type_name}`] ?? null;
	}

	public getParserType(id: number, file: FileContext, maxLength?: number): string {
		const override = this.config.types.parserOverrides[id];
		if (override !== undefined) {
			const [type, imports] = override;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}

		if (id in OID) {
			const string = OID[id],
				override = this.config.types.parserOverrides[string];

			if (override !== undefined) {
				const [type, imports] = override;
				for (const importStatement of imports) file.addImportStatement(importStatement);
				return type;
			}
		}

		const builtin = DefaultParserMapping.get(id, maxLength);
		if (builtin !== undefined) {
			if (!Array.isArray(builtin)) return builtin;

			const [type, imports] = builtin;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}

		const type = this.types.get(id);
		if (!type) return "unknown";

		const globalOverride = this._getParserOverride(type);
		if (globalOverride !== null) {
			const [type, imports] = globalOverride;
			for (const importStatement of imports) file.addImportStatement(importStatement);
			return type;
		}
		return getParserType(type, this, file, maxLength);
	}

	public async print() {
		const allClasses = [...this.classes.values()].filter(cls => cls.kind === ClassKind.OrdinaryTable),
			databaseClassLists: ClassDetails[][] = [];

		for (const cls of allClasses) {
			const classList = databaseClassLists.find(c => c[0].database_name === cls.database_name);
			if (classList) classList.push(cls);
			else databaseClassLists.push([cls]);
		}

		printAllDetails(databaseClassLists, this);

		return await this.writeFiles();
	}

	private async writeFiles() {
		const { directory } = this.config.types,
			files = this.context.getFiles(),
			filenames = new Set(files.map(f => f.filename));

		//* Create directory if it doesn't exist
		mkdirp.sync(directory);

		//* Delete files that would no longer be output
		const directoryFiles = await promises.readdir(directory);
		await Promise.all(
			directoryFiles
				.filter(fileName => !filenames.has(fileName))
				.map(async fileName => {
					const filePath = join(directory, fileName),
						file = await promises.stat(filePath);
					if (file.isFile()) {
						const source = await promises.readFile(filePath, "utf8");
						if (source.includes(GENERATED_STATEMENT)) {
							this.LOGGER(`Deleting: ${fileName}`);
							await promises.unlink(filePath);
						}
					}
				})
		);

		await Promise.all(
			files.map(async f => {
				const filename = join(directory, f.filename);
				if (filename.endsWith(".ts")) {
					const content = f.content.trim(),
						checksum = `Checksum: ${createHash("sha512").update(content).digest("base64")}`;

					try {
						const existingSource = await promises.readFile(filename, "utf8");
						if (existingSource.includes(checksum)) return;
						this.LOGGER(`Updating: ${f.filename}`);
					} catch (error: any) {
						if (error.code !== "ENOENT") throw error;
						this.LOGGER(`Writing: ${f.filename}`);
					}

					//* Double check nested folders exist
					mkdirp.sync(dirname(filename));

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
						this.LOGGER(`Updating: ${f.filename}`);
					} catch (error: any) {
						if (error.code !== "ENOENT") throw error;
						this.LOGGER(`Writing: ${f.filename}`);
					}

					await promises.writeFile(filename, f.content);
				}
			})
		);
	}
}
