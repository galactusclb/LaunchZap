import { intFromAny, trimmedString } from "@/lib/zod/extras.ts";

import z from "zod";

export const orderBaseSchema = z.object({
    orderDescription: trimmedString.min(1).max(100),
    productIds: z.array(intFromAny)
});

export const createOrderSchema = {
    headers: z.object({
        'idempotency-key': z.string({ required_error: 'Idempotency key is required' }).uuid('Invalid idempotency key format')
    }).passthrough(),
    body: orderBaseSchema.extend({
        productIds: orderBaseSchema.shape.productIds.min(1),
    })
}

export const updateOrderSchema = {
    params: z.object({
        id: intFromAny.positive(),
    }),
    body: orderBaseSchema.partial(),
}

export const getOrderByIdSchema = {
  params: z.object({
    id: intFromAny.positive(),
  }),
};

export const deleteOrderSchema = getOrderByIdSchema;

export type Order = z.infer<typeof orderBaseSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema.body>;
export type CreateOrderHeader = z.infer<typeof createOrderSchema.headers>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema.body>;
export type GetOrderByIdParams = z.infer<typeof getOrderByIdSchema.params>;
export type DeleteOrderInput = GetOrderByIdParams;