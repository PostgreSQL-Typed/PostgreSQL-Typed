import { Debug } from "../commands/Debug.js";
import { Generate } from "../commands/Generate.js";
import { Help } from "../commands/Help.js";
import { Init } from "../commands/Init.js";
import { Version } from "../commands/Version.js";
import type { Argument } from "../types/interfaces/Argument.js";
import type { Command } from "../types/interfaces/Command.js";
import { DebugOnly } from "./DebugOnly.js";

export const commands: Command[] = [Init, Generate];
export const priorityArguments: Argument[] = [Version, Help];
export const globalArugments: Argument[] = [...priorityArguments, Debug, DebugOnly];

export { Help as DEFAULT_COMMAND } from "../commands/Help.js";
