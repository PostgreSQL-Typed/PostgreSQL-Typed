import { type Stats, statSync } from "node:fs";
import { dirname, join } from "node:path";

function tryStatSync(file: string): Stats | undefined {
	try {
		return statSync(file, { throwIfNoEntry: false });
	} catch {}
}

export function findFile(directory: string, fileName: string): string | undefined {
	while (directory) {
		const fullPath = join(directory, fileName);
		if (tryStatSync(fullPath)?.isFile()) return fullPath;

		const parentDirectory = dirname(directory);
		if (parentDirectory === directory) return;

		directory = parentDirectory;
	}
}
