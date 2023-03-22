import debug from "debug";

export function isDebugEnabled(): boolean {
	return debug.names.length > 0;
}
