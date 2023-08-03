export const defaultCardinality = formatCardinality("0+--0+"),
	defaultRelationship = "associates with";

/**
 * Parses link and extra columns from a column comment
 *
 * @param comment Comment to parse
 * @param splitChar Character to split comment into lines
 * @returns Object containing links, extra columns and description
 */
export function parseColumnComment(comment: string) {
	const splitChar = "|", //TODO: make this configurable
		//* Split comment into lines using splitChar as delimiter (as long as the splitChar is not escaped)
		lines = comment.split(new RegExp(`(?<!\\\\)[${splitChar}]`)).map(line => line.replaceAll("\\|", "|")),
		links = parseLink(lines);
	if (links.succeeded) {
		lines.splice(lines.indexOf(links.linkLine), 1);
		if (links.cardinalityLine) lines.splice(lines.indexOf(links.cardinalityLine), 1);
		if (links.relationshipLine) lines.splice(lines.indexOf(links.relationshipLine), 1);
	}
	const extraColumns = parseExtraColumns(lines);
	if (extraColumns.succeeded) for (const originalLine of extraColumns.originalLines) lines.splice(lines.indexOf(originalLine), 1);

	return {
		cardinality: links.succeeded ? links.cardinality : undefined,
		description: lines.filter(Boolean).join(splitChar),
		extraColumns: extraColumns.succeeded ? extraColumns.extraColumns : undefined,
		link: links.succeeded ? links.link : undefined,
		relationship: links.succeeded ? links.relationship : undefined,
	};
}

/**
 * Parses link from a column comment
 *
 * @example link:schema.table.column
 * @example link=schema.table.column
 *
 * @param lines Lines to parse
 * @returns Object containing links and original line
 */
function parseLink(lines: string[]):
	| {
			succeeded: true;
			link: string;
			linkLine: string;
			cardinality: string;
			cardinalityLine?: string;
			relationship: string;
			relationshipLine?: string;
	  }
	| {
			succeeded: false;
	  } {
	//* If the line starts with links: or links=, the rest of the line is the link
	const linkLine = lines.find(line => line.startsWith("link:") || line.startsWith("link="));
	if (!linkLine) return { succeeded: false };

	let cardinalityLine = lines.find(line => line.startsWith("cardinality:") || line.startsWith("cardinality=")),
		cardinality = defaultCardinality;

	if (cardinalityLine) {
		const parsedCardinality = cardinalityLine.replace(/^cardinality[:=]/, "");
		//* Make sure the link type is valid, one of 0+, 1, 1+, 01 and then -- or .. and then 0+, 1, 1+, 01
		if (/^(0\+|1|1\+|01)(--|\.\.)(0\+|1|1\+|01)$/.test(parsedCardinality)) cardinality = formatCardinality(parsedCardinality);
		else cardinalityLine = undefined;
	}

	const relationshipLine = lines.find(line => line.startsWith("relationship:") || line.startsWith("relationship=")),
		relationship = relationshipLine?.replace(/^relationship[:=]/, "") || defaultRelationship;

	return {
		cardinality,
		cardinalityLine,
		link: linkLine.replace(/^link[:=]/, ""),
		linkLine,
		relationship,
		relationshipLine,
		succeeded: true,
	};
}

/**
 * Parses extra columns from a column comment
 *
 * @example [key]:value
 * @example [key]=value
 *
 * @param lines Lines to parse
 * @returns Object containing extra columns and original lines
 */
function parseExtraColumns(lines: string[]):
	| {
			succeeded: true;
			extraColumns: { [key: string]: string };
			originalLines: string[];
	  }
	| {
			succeeded: false;
	  } {
	const extraColumns: { [key: string]: string } = {},
		originalLines: string[] = [];
	for (const line of lines) {
		//* If the line starts with [key]: or [key]=, parse the rest of the line as the value (it must also contain the square brackets)
		const match = line.match(/^(?<key>[^:]+):(?<value>.+)/) || line.match(/^(?<key>[^=]+)=(?<value>.+)/);
		if (!match) continue;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		let { value } = match.groups!;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { key } = match.groups!;
		if (!key || !value) continue;
		//* Try to parse the value
		try {
			value = JSON.parse(value);
		} catch {}

		//* Remove the square brackets from the key
		extraColumns[key.replaceAll(/^\[|]$/g, "")] = value;
		originalLines.push(line);
	}

	if (Object.keys(extraColumns).length === 0) return { succeeded: false };
	return {
		extraColumns,
		originalLines,
		succeeded: true,
	};
}

function formatCardinality(string: string): string {
	const leftReplacements: Record<string, string> = {
			"0+": "}o",
			"01": "|o",
			1: "||",
			"1+": "}|",
		},
		rightReplacements: Record<string, string> = {
			"0+": "o{",
			"01": "o|",
			1: "||",
			"1+": "|{",
		},
		//* Split by -- or ..
		[left, right] = string.split(/--|\.\./),
		//* Replace left and right with the correct replacements, and join them back together with -- or ..
		splitter = string.includes("--") ? "--" : "..";
	return `${leftReplacements[left]}${splitter}${rightReplacements[right]}`;
}
