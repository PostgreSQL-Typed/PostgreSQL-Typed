import type { Config } from "../../types/interfaces/Config";
import type { IdentifierName } from "../../types/types/IdentifierName";
import type { TypeID } from "../../types/types/TypeID";
import { getExportNameTemplate } from "../functions/getters/getExportNameTemplate";
import { getTemplateValues } from "../functions/getters/getTemplateValues";
import { parseTemplate } from "../functions/parseTemplate";

export function resolveExportName(config: Config, id: TypeID): IdentifierName {
	return parseTemplate(getExportNameTemplate(config, id)).applyTemplate(getTemplateValues(id));
}
