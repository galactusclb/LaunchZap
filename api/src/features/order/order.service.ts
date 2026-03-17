import prisma from "@/lib/prisma/prisma.ts";

import { Order } from "@prisma/client";

import { PaginationOptions } from "../../interfaces/paginate.type.ts";
import { BadRequestError, NotFoundError } from "../../utils/errors/http-error.ts";

import * as repo from "./order.repository.ts";
import { CreateOrderHeader, CreateOrderInput, UpdateOrderInput } from "./order.schema.ts";

export const doGetAllOrders = async <T>({ pagination, filters }: {
  pagination: PaginationOptions<T>;
  filters: Partial<T>;
}) => await repo.findAll({ pagination, filters });

export const doGetOrderById = async (id: Order['id']) => {
    const order = await repo.findById(id);

    if (!order) {
        throw new NotFoundError("Order not found");
    }

    return order;
}

export const doCreateOrder = async (input: CreateOrderInput, idempotencyKey: CreateOrderHeader['idempotency-key']) => {
    return prisma.$transaction(async (tx)=>{
        const existingOrder = await repo.findOrderByIdempotencyKey(idempotencyKey, tx);

        if(existingOrder) return existingOrder;

        return await repo.createOrder(input, idempotencyKey ,tx); 
    });

}

export const doUpdateOrder = async (id: Order['id'], input: UpdateOrderInput) => {
    const order = await repo.findById(id);
    
    if (!order) {
        throw new NotFoundError('Order not found');
    }
    
    if (input.orderDescription) {
        await repo.updateOrder(id, { orderDescription: input.orderDescription });
    }

    return await repo.findById(id);
}

export const doDeleteOrder = async (id: Order['id'])=>{
    const deleteOrder = await repo.deleteOrderWithOrderRefferences(id);

    if(!deleteOrder) throw new NotFoundError('Order not found');

    return deleteOrder;
}