import type { Config } from "../../types/interfaces/Config.js";
import type { FileName } from "../../types/types/FileName.js";
import type { TypeId } from "../../types/types/TypeId.js";
import { getFilenameTemplate } from "../functions/getters/getFilenameTemplate.js";
import { getTemplateValues } from "../functions/getters/getTemplateValues.js";
import { parseTemplate } from "../functions/parseTemplate.js";

export function resolveFilename(config: Config, id: TypeId): FileName {
	return parseTemplate(getFilenameTemplate(config, id)).applyTemplate(getTemplateValues(id));
}
