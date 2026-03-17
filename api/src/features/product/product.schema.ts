import { trimmedString } from "@/lib/zod/extras.ts";

import z from "zod";

export const baseProductSchema = z.object({
    productName: trimmedString.min(1).max(100),
    productDescription: trimmedString.max(1000).optional(),
});

export type Product = z.infer<typeof baseProductSchema>;