import { B, c, w } from "../../../util/chalk.js";
import { NAME } from "../../../util/constants.js";

export function getConsoleHeader(line2: string, line3: string, doubleBackslash = false, extraLine?: string): string {
	const line1 = B.underline(NAME);
	return doubleBackslash
		? `
  ${c("____  ______  ___")}
 ${c("/    )/      \\\\/   \\\\")}
${c("(     / __    _\\\\    )")}   ${line1}
 ${c("\\\\    (/")} ${w("o")}${c(")  (")} ${"o"}${c(")   )")}
  ${c("\\\\_  (_  )   \\\\ )  /")}    ${line2}
    ${c("\\\\  /\\\\_/    \\\\)_/")}
     ${c("\\\\/")}  ${w("//")}${c("|  |")}${w("\\\\\\\\")}       ${line3}
         ${w("v")} ${c("|  |")} ${w("v")}       ${extraLine ?? ""}
           ${c("\\\\__/")}
`
		: `
  ${c("____  ______  ___")}
 ${c("/    )/      \\/   \\")}
${c("(     / __    _\\    )")}   ${line1}
 ${c("\\    (/")} ${w("o")}${c(")  (")} ${"o"}${c(")   )")}
  ${c("\\_  (_  )   \\ )  /")}    ${line2}
    ${c("\\  /\\_/    \\)_/")}
     ${c("\\/")}  ${w("//")}${c("|  |")}${w("\\\\")}       ${line3}
         ${w("v")} ${c("|  |")} ${w("v")}       ${extraLine ?? ""}
           ${c("\\__/")}
`;
}
