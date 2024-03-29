import { pathToFileURL } from "node:url";

import { interopDefault, resolvePath } from "mlly";

export async function importModule(id: string, url: string | string[] = import.meta.url) {
	const resolvedPath = await resolvePath(id, { url });
	return import(pathToFileURL(resolvedPath).href).then(interopDefault);
}
