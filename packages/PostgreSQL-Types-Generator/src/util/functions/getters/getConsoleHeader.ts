import { B, c, w } from "../../../util/chalk";
import { NAME } from "../../../util/constants";

export function getConsoleHeader(line2: string, line3: string, doubleBackslash = false, extraLine?: string): string {
	const line1 = B.underline(NAME);
	if (doubleBackslash) {
		return `
  ${c("____  ______  ___")}
 ${c("/    )/      \\\\/   \\\\")}
${c("(     / __    _\\\\    )")}   ${line1}
 ${c("\\\\    (/")} ${w("o")}${c(")  (")} ${"o"}${c(")   )")}
  ${c("\\\\_  (_  )   \\\\ )  /")}    ${line2}
    ${c("\\\\  /\\\\_/    \\\\)_/")}
     ${c("\\\\/")}  ${w("//")}${c("|  |")}${w("\\\\\\\\")}       ${line3}
         ${w("v")} ${c("|  |")} ${w("v")}       ${extraLine ?? ""}
           ${c("\\\\__/")}
`;
	} else {
		return `
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
}
