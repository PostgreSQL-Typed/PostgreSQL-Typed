import type { Config } from "../../types/interfaces/Config";
import type { FileName } from "../../types/types/FileName";
import type { TypeID } from "../../types/types/TypeID";
import { getFilenameTemplate } from "../functions/getters/getFilenameTemplate";
import { getTemplateValues } from "../functions/getters/getTemplateValues";
import { parseTemplate } from "../functions/parseTemplate";

export function resolveFilename(config: Config, id: TypeID): FileName {
	return parseTemplate(getFilenameTemplate(config, id)).applyTemplate(getTemplateValues(id));
}
