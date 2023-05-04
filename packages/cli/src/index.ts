import "source-map-support/register.js";

import { Generate as Gen } from "./commands/Generate.js";

const Generate = Gen.run;
export default Generate;
