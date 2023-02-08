import { Dirent } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

const directories = await readdir(resolve("../../__tests__/__generated__"), {
	withFileTypes: true,
});

for (const directory of directories) await checkDirectory(directory, "../../__tests__/__generated__");

async function checkDirectory(file: Dirent, ...parents: string[]) {
	if (file.isDirectory()) {
		const files = await readdir(resolve(...parents, file.name), {
			withFileTypes: true,
		});

		for (const nfile of files) await checkDirectory(nfile, ...parents, file.name);
	} else {
		const content = await readFile(resolve(...parents, file.name), "utf8"),
			newContent = content.split('from "postgresql-typed"').join(
				`from "${relative(resolve(...parents, file.name), resolve("../../src"))
					.split("\\")
					.join("/")
					.replace("../", "")}"`
			);

		if (content !== newContent) await writeFile(resolve(...parents, file.name), newContent);
	}
}
