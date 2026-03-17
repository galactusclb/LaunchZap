import { Prisma } from '@prisma/client';

import { Request, Response } from 'express';

import { parseQueryParams } from '../../utils/paginate-helpers.ts';

import { CreateOrderHeader, CreateOrderInput } from './order.schema.ts';
import * as orderService from './order.service.ts';

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {

    const allowedFilters: (keyof Prisma.OrderWhereInput)[] = ['orderDescription', 'id'];

    const { filters, pagination } = parseQueryParams<Prisma.OrderWhereInput>(
      req.query, allowedFilters, 'Order'
    );

    const orders = await orderService.doGetAllOrders({filters, pagination});
    res.status(200).json({ success: true, ...orders })
}

export const getOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await orderService.doGetOrderById(Number(id));

    res.status(200).json({
        success: true,
        data: order
    });
}

export const createOrder = async (req: Request, res: Response) => {
    const idempotencyKey = (req.headers as CreateOrderHeader)['idempotency-key'];

    const order = await orderService.doCreateOrder(req.body as CreateOrderInput, idempotencyKey);

    res.status(201).json({ success: true, data: order });
}

export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedOrder = await orderService.doUpdateOrder(Number(id), req.body);
    res.status(200).json({ success: true, data: updatedOrder });
}

export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await orderService.doDeleteOrder(Number(id));

    res.status(200).json({ success: true, message: "Order delete success", data: order });
}