import camelcase from "camelcase";
import pascalcase from "pascalcase";
import { plural, singular } from "pluralize";

export function parseTemplate(string: string) {
	const variables = [],
		result: ((values: any) => string)[] = [];
	let inVariables = false;

	for (const part of string.split("{{")) {
		if (inVariables) {
			const split = part.split("}}");
			if (split.length !== 2) throw new Error(`Mismatched parentheses: ${string}`);

			const [placeholder, plainString] = split,
				[variable, ...filters] = placeholder.split("|").map(string_ => string_.trim());

			variables.push(variable);
			result.push(
				values => {
					if (!(variable in values)) throw new Error(`Unrecognized variable ${variable} in ${string}`);

					// eslint-disable-next-line unicorn/no-array-reduce
					return filters.reduce((value, filter) => {
						if (filter.startsWith("replace")) {
							const parts = filter.split(" ");
							if (parts.length !== 3 || parts[0] !== "replace") {
								throw new Error(
									`Unrecognized filter in type generation config, "${filter}". Replace filters should be in the format {{ variable | replace "some-regex" "some-string" }}: ${string}`
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
								throw new Error(`Unrecognized filter in type generation config, "${filter}" in: ${string}`);
						}
					}, values[variable]);
				},
				() => plainString
			);
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
