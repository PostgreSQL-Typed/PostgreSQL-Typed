import { Debug } from "../commands/Debug";
import { Generate } from "../commands/Generate";
import { Help } from "../commands/Help";
import { Init } from "../commands/Init";
import { Version } from "../commands/Version";
import type { Argument } from "../types/interfaces/Argument";
import type { Command } from "../types/interfaces/Command";

export const commands: Command[] = [Init, Generate];
export const priorityArguments: Argument[] = [Version, Help];
export const globalArugments: Argument[] = [...priorityArguments, Debug];

export const DEFAULT_COMMAND = Help;
