import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { FileName } from "../../types/types/FileName.js";
import type { TypeId } from "../../types/types/TypeId.js";
import { getFilenameTemplate } from "../functions/getters/getFilenameTemplate.js";
import { getTemplateValues } from "../functions/getters/getTemplateValues.js";
import { parseTemplate } from "../functions/parseTemplate.js";

export function resolveFilename(config: PostgreSQLTypedCLIConfig, id: TypeId): FileName {
	return parseTemplate(getFilenameTemplate(config, id), config).applyTemplate(getTemplateValues(id));
}
