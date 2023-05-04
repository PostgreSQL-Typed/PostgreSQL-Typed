import { existsSync, readFileSync, realpath, unlink } from "node:fs";
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { build } from "esbuild";

import { findFile } from "./findFile.js";
import { DEFAULT_CONFIG_FILES } from "./index.js";

const promisifiedRealpath = promisify(realpath);

export async function resolveConfig(
	configFile?: string,
	configRoot: string = process.cwd()
): Promise<{ config: Record<string, any>; filePath: string } | undefined> {
	let resolvedPath: string | undefined;

	if (configFile) resolvedPath = resolve(configFile);
	else {
		for (const filename of DEFAULT_CONFIG_FILES) {
			const filePath = resolve(configRoot, filename);
			if (!existsSync(filePath)) continue;

			resolvedPath = filePath;
			break;
		}
	}

	if (!resolvedPath) return undefined;

	let isESM = false;
	if (/\.m[jt]s$/.test(resolvedPath)) isESM = true;
	else if (/\.c[jt]s$/.test(resolvedPath)) isESM = false;
	// If it's not a .js or .ts file, we don't know if it's ESM or CJS, we will just not fetch it.
	else {
		// check package.json for type: "module" and set `isESM` to true
		try {
			const package_ = findFile(configRoot, "package.json");
			isESM = !!package_ && JSON.parse(readFileSync(package_, "utf8")).type === "module";
		} catch {}
	}

	const result = await build({
			absWorkingDir: process.cwd(),
			entryPoints: [resolvedPath],
			outfile: "out.js",
			write: false,
			target: ["node14.18", "node16"],
			platform: "node",
			bundle: true,
			format: isESM ? "esm" : "cjs",
			mainFields: ["main"],
			sourcemap: "inline",
			metafile: true,
			banner: {
				js: `
        import { fileURLToPath } from 'url';
        import { createRequire as topLevelCreateRequire } from 'module';
				import path from 'path';
        const require = topLevelCreateRequire(import.meta.url);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        `,
			},
			plugins: [
				{
					name: "externalize-deps",
					setup(build) {
						// externalize bare imports
						build.onResolve({ filter: /^[^.].*/ }, ({ path }) => {
							if (path === resolvedPath) return;
							return { external: true };
						});
					},
				},
			],
		}),
		// for esm, before we can register loaders without requiring users to run node
		// with --experimental-loader themselves, we have to do a hack here:
		// write it to disk, load it with native Node ESM, then delete the file.
		_require = createRequire(import.meta.url);
	if (isESM) {
		const fileBase = `${resolvedPath}.timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
			fileNameTemporary = `${fileBase}.mjs`,
			fileUrl = `${pathToFileURL(fileBase)}.mjs`;
		await writeFile(fileNameTemporary, result.outputFiles[0].text);

		try {
			const imported = await import(fileUrl);
			return { config: imported.default, filePath: resolvedPath };
		} finally {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			unlink(fileNameTemporary, () => {}); // Ignore errors
		}
	} else {
		// for cjs, we can register a custom loader via `_require.extensions`
		const extension = extname(resolvedPath),
			// We don't use fsp.realpath() here because it has the same behaviour as
			// fs.realpath.native. On some Windows systems, it returns uppercase volume
			// letters (e.g. "C:\") while the Node.js loader uses lowercase volume letters.
			realFileName = await promisifiedRealpath(resolvedPath),
			loaderExtension = extension in _require.extensions ? extension : ".js",
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			defaultLoader = _require.extensions[loaderExtension]!;
		_require.extensions[loaderExtension] = (module: NodeModule, filename: string) => {
			if (filename === realFileName) (module as NodeModuleWithCompile)._compile(result.outputFiles[0].text, filename);
			else defaultLoader(module, filename);
		};
		// clear cache in case of server restart
		delete _require.cache[_require.resolve(resolvedPath)];
		const raw = _require(resolvedPath);
		_require.extensions[loaderExtension] = defaultLoader;
		return { config: raw.__esModule ? raw.default : raw, filePath: resolvedPath };
	}
}

interface NodeModuleWithCompile extends NodeModule {
	_compile(code: string, filename: string): any;
}
