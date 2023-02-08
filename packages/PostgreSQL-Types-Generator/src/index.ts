import "source-map-support/register";

import { Generate as Gen } from "./commands/Generate.js";

export * from "./util/zJson.js";

const Generate = Gen.run;
export default Generate;
