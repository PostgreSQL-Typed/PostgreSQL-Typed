import jiti from "jiti";
import { normalize } from "pathe";

const _require = (jiti as unknown as typeof jiti.default)(process.cwd(), { interopDefault: true, esmResolve: true });

export function requireModule(id: string, options: RequireModuleOptions = {}) {
	// Resolve id
	const resolvedPath = resolveModule(id, options),
		// Try to require
		requiredModule = _require(resolvedPath);

	return requiredModule;
}

export interface RequireModuleOptions {
	paths?: string | string[];
}

function resolveModule(id: string, options: RequireModuleOptions = {}) {
	return normalize(
		_require.resolve(id, {
			paths: [...(options.paths ? [options.paths].flat() : []), process.cwd()].filter(Boolean),
		})
	);
}
