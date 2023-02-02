import debug from "debug";

import { GLOBAL_DEBUG_GLOB } from "../../util/constants";

export function isDebugEnabled(): boolean {
	return debug.enabled(GLOBAL_DEBUG_GLOB);
}
