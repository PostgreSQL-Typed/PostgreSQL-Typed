import "source-map-support/register";

import { Generate as Gen } from "./commands/Generate";

export * from "./util/zJson";

const Generate = Gen.run;
export default Generate;
