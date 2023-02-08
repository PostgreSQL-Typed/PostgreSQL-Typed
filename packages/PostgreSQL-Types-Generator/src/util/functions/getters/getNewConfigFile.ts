import type { Config } from "../../../types/interfaces/Config.js";

export function getNewConfigFile(config: Config): string {
	return `${CONFIG_HEADER}${getStringifyedConfig(config)}${CONFIG_FOOTER}`;
}

function getStringifyedConfig(cfg: Record<string, any>, tabCount = 1): string {
	const properties = Object.keys(cfg);
	let output = "";
	for (const [index, property] of properties.entries()) {
		const isLast = index === properties.length - 1 ? "" : ",",
			tab = "\t".repeat(tabCount);

		switch (typeof cfg[property]) {
			case "object":
				if (Object.keys(cfg[property]).length > 0) {
					output += `${tab}${property}: {\n`;
					output += getStringifyedConfig(cfg[property], tabCount + 1);
					output += `${tab}}${isLast}\n`;
				} else output += `${tab}${property}: {}${isLast}\n`;
				break;
			case "string":
				output += `${tab}${property}: "${cfg[property]}"${isLast}\n`;
				break;
			default:
				output += `${tab}${property}: ${cfg[property]}${isLast}\n`;
				break;
		}
	}
	return output;
}

const CONFIG_HEADER = `/**
 * Configuration file for pgtg (PostgreSQL Types Generator)
 *
 * For a detailed explanation regarding each configuration property, and the default values, see the README.md file.
 */

/** @type {import('postgresql-types-generator/lib/types/types/ConfigFile').ConfigFile} */
module.exports = {
`,
	CONFIG_FOOTER = "};";
