/**
 * Get a database shortened identifier for the table (e.g. "schema.users" -> "u", "schema.user_names" -> "un", "schema.unavailable_user_names" -> "uun")
 *
 * @param table string - The table location to get the identifier for
 * @param usedIdentifiers string[] - The identifiers that have already been used
 * @returns string - The shortened identifier
 */
export function getTableIdentifier(table: string, usedIdentifiers: string[]): string {
	const identifierPart = table.split(".").pop(),
		identifierShortened =
			identifierPart
				?.split("_")
				.map(part => part[0])
				.join("") || "unknown";

	//* Make sure the shortened identifier isn't already in use
	if (usedIdentifiers.includes(identifierShortened)) {
		//* If it is, add a number to the end of it until it isn't
		let index = 1;
		while (usedIdentifiers.includes(identifierShortened + index)) index++;
		return identifierShortened + index;
	}

	return identifierShortened;
}
