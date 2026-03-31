import { Router } from 'express';

import { validate } from '../../middleware/validate.middleware.ts';

import { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from './order.controller.ts';
import { createOrderSchema, deleteOrderSchema, getOrderByIdSchema, updateOrderSchema } from './order.schema.ts';

const router = Router();

router.get('/', getAllOrders);
router.get('/:id', validate(getOrderByIdSchema), getOrder);
router.post('/', validate(createOrderSchema), createOrder);
router.put('/:id', validate(updateOrderSchema), updateOrder);
router.delete('/:id', validate(deleteOrderSchema), deleteOrder)

export default router;
