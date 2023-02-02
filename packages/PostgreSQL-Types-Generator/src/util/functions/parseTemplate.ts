import camelcase from "camelcase";
import pascalcase from "pascalcase";
import { plural, singular } from "pluralize";

export function parseTemplate(str: string) {
	const variables = [],
		result: ((values: any) => string)[] = [];
	let inVariables = false;

	for (const part of str.split("{{")) {
		if (inVariables) {
			const split = part.split("}}");
			if (split.length !== 2) throw new Error(`Mismatched parentheses: ${str}`);

			const [placeholder, plainString] = split,
				[variable, ...filters] = placeholder.split("|").map(str => str.trim());

			variables.push(variable);
			result.push(values => {
				if (!(variable in values)) throw new Error(`Unrecognized variable ${variable} in ${str}`);

				return filters.reduce((value, filter) => {
					if (filter.startsWith("replace")) {
						const parts = filter.split(" ");
						if (parts.length !== 3 || parts[0] !== "replace") {
							throw new Error(
								`Unrecognized filter in type generation config, "${filter}". Replace filters should be in the format {{ variable | replace "some-regex" "some-string" }}: ${str}`
							);
						}

						return `${value}`.replaceAll(new RegExp(JSON.parse(parts[1]), "g"), JSON.parse(parts[2]));
					}
					switch (filter) {
						case "pascal-case":
							return pascalcase(value);
						case "camel-case":
							return camelcase(value);
						case "plural":
							return plural(value);
						case "singular":
							return singular(value);
						default:
							throw new Error(`Unrecognized filter in type generation config, "${filter}" in: ${str}`);
					}
				}, values[variable]);
			});
			result.push(() => plainString);
		} else {
			inVariables = true;
			result.push(() => part);
		}
	}
	return {
		variables,
		applyTemplate: (value: any) => result.map(r => r(value)).join(""),
	};
}
