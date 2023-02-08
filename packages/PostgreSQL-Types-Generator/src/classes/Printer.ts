import { createHash } from "node:crypto";
import { promises } from "node:fs";
import { dirname, join } from "node:path";

import { sync as mkdirp } from "mkdirp";
import { DataType as DataTypeID } from "postgresql-data-types";

import { PrinterContext } from "../classes/PrinterContext.js";
import { ClassKind } from "../types/enums/ClassKind.js";
import type { ClassDetails } from "../types/interfaces/ClassDetails.js";
import type { Config } from "../types/interfaces/Config.js";
import type { FetchedData } from "../types/interfaces/FetchedData.js";
import type { FileContext } from "../types/interfaces/FileContext.js";
import type { DataType } from "../types/types/DataType.js";
import { GENERATED_STATEMENT, LOGGER } from "../util/constants.js";
import { DefaultTypeScriptMapping } from "../util/DefaultTypeScriptMapping.js";
import { DefaultZodMapping } from "../util/DefaultZodMapping.js";
import { getTypeScriptType } from "../util/functions/getters/getTypeScriptType.js";
import { getZodType } from "../util/functions/getters/getZodType.js";
import { printDatabaseDetails } from "../util/functions/printers/printDatabaseDetails.js";
import { printDatabaseZod } from "../util/functions/printers/printDatabaseZod.js";

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

	public getTypeScriptType(id: number, file: FileContext): string {
		const override = this.config.types.typeOverrides[id];
		if (override !== undefined) return override;

		if (id in DataTypeID) {
			const string = DataTypeID[id],
				override = this.config.types.typeOverrides[string];

			if (override !== undefined) return override;
		}

		const builtin = DefaultTypeScriptMapping.get(id);
		if (builtin) {
			if (!Array.isArray(builtin)) return builtin;

			const [type, imports] = builtin;
			for (const stringImport of imports) file.addStringImport(stringImport);
			return type;
		}

		const type = this.types.get(id);
		if (!type) return "unknown";
		return this._getTypeOverride(type) ?? getTypeScriptType(type, this, file);
	}

	private _getZodOverride(type: DataType): string | null {
		return this.config.types.zod.zodOverrides[`${type.schema_name}.${type.type_name}`] ?? this.config.types.zod.zodOverrides[`${type.type_name}`] ?? null;
	}

	public getZodType(id: number, file: FileContext) {
		file.addStringImport('import { z } from "zod";');

		const override = this.config.types.typeOverrides[id];
		if (override !== undefined) return override;

		if (id in DataTypeID) {
			const string = DataTypeID[id],
				override = this.config.types.zod.zodOverrides[string];

			if (override !== undefined) return override;
		}

		const builtin = DefaultZodMapping.get(id);
		if (builtin) {
			if (!Array.isArray(builtin)) return builtin;

			for (const stringImport of builtin[1]) file.addStringImport(stringImport);
			return builtin[0];
		}
		const type = this.types.get(id);
		if (!type) return "z.string()";
		return this._getZodOverride(type) ?? getZodType(type, this, file);
	}

	public async print() {
		const allClasses = [...this.classes.values()].filter(cls => cls.kind === ClassKind.OrdinaryTable),
			databaseClassLists: ClassDetails[][] = [];

		for (const cls of allClasses) {
			const classList = databaseClassLists.find(c => c[0].database_name === cls.database_name);
			if (classList) classList.push(cls);
			else databaseClassLists.push([cls]);
		}

		for (const classList of databaseClassLists) printDatabaseDetails(classList, this);
		if (this.config.types.zod.enabled) for (const classList of databaseClassLists) printDatabaseZod(classList, this);

		return await this.writeFiles();
	}

	private async writeFiles() {
		const { directory } = this.config.types,
			files = this.context.getFiles(),
			filenames = new Set(files.map(f => f.filename));

		//* Create directory if it doesn't exist
		mkdirp(directory);

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
					mkdirp(dirname(filename));

					await promises.writeFile(
						filename,
						[
							"/**",
							" * !!! This file is autogenerated do not edit by hand !!!",
							" *",
							` * ${GENERATED_STATEMENT}`,
							` * ${checksum}`,
							" */",
							"",
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
