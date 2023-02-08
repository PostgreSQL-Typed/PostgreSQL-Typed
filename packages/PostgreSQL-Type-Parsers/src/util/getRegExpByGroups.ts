export const getRegExpByGroups = <T extends Record<string, string>>(options?: {
	/**
	 * The base RegExp string.
	 *
	 * Use `%others%` to represent other groups.
	 * @example
	 * ```ts
	 * "^%others%$"
	 * ```
	 * @default
	 * ```ts
	 * "^\s*%others%$"
	 * ```
	 */
	base?: RegExp;
	/**
	 * The groups to be included in the RegExp.
	 */
	groups?: string[];
}): {
	match: (string: string) => T | null;
} => {
	return {
		match: (string: string) => {
			const newOptions = {
				base: /^\s*%others%$/,
				groups: [],
				...options,
			};

			// If the array is empty, match the string with the base RegExp
			if (newOptions.groups.length === 0)
				return (string.match(new RegExp(newOptions.base.source.replace("%others%", ""), newOptions.base.flags))?.groups as T) ?? null;

			// If the array has only one element, match the string with the base RegExp
			if (newOptions.groups.length === 1)
				return (string.match(new RegExp(newOptions.base.source.replace("%others%", newOptions.groups[0]), newOptions.base.flags))?.groups as T) ?? null;

			// Otherwise test the string against the groups and map the results to the index of the string in the array
			const allPositions: (string | null)[] = [...Array.from({ length: string.length }).keys()].map(() => null);

			for (const group of newOptions.groups) {
				const match = string.match(new RegExp(group, "g")),
					newMatch = [...(match ?? [])].find(m => !!m);
				if (!newMatch) continue;

				// If the match is not found, continue
				const index = string.indexOf(newMatch);
				/* c8 ignore next */
				if (index === -1) continue;

				// If the index is already occupied, check if the other matches are occupied
				if (allPositions[index] !== null) {
					/* c8 ignore next */
					const otherMatches = [...(match ?? [])].filter(m => !!m).slice(1);

					// If there are no other matches, continue
					if (otherMatches.length === 0) continue;

					// Otherwise, check if the other matches are occupied
					for (const otherMatch of otherMatches) {
						const otherIndex = string.indexOf(otherMatch);
						/* c8 ignore next */
						if (otherIndex === -1) continue;

						// If the other index is already occupied, continue
						if (allPositions[otherIndex] !== null) continue;
						allPositions[otherIndex] = group;
					}

					continue;
				}
				allPositions[index] = group;
			}

			//Remove all nulls from the array and join the remaining groups with the base RegExp
			const groups = allPositions.filter(group => group !== null);
			if (groups.length === 0) return null;
			return (string.match(new RegExp(newOptions.base.source.replace("%others%", groups.join("")), newOptions.base.flags))?.groups as T) ?? null;
		},
	};
};
