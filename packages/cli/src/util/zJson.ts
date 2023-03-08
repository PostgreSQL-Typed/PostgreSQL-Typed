import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;

type JsonInner = Literal | { [key: string]: JsonInner } | JsonInner[];
const jsonInner: z.ZodType<JsonInner> = z.lazy(() => z.union([literalSchema, z.array(jsonInner), z.record(jsonInner)]));

export type Json = { [key: string]: JsonInner } | JsonInner[];
export const zJson: z.ZodType<Json> = z.lazy(() => z.union([z.array(jsonInner), z.record(jsonInner)]));
