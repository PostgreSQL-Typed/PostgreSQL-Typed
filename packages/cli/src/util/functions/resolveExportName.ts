import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { IdentifierName } from "../../types/types/IdentifierName.js";
import type { TypeId } from "../../types/types/TypeId.js";
import { getExportNameTemplate } from "../functions/getters/getExportNameTemplate.js";
import { getTemplateValues } from "../functions/getters/getTemplateValues.js";
import { parseTemplate } from "../functions/parseTemplate.js";

export function resolveExportName(config: PostgreSQLTypedCLIConfig, id: TypeId): IdentifierName {
	return parseTemplate(getExportNameTemplate(config, id)).applyTemplate(getTemplateValues(id));
}
