import { Router } from 'express';
import {createProduct, getAllProducts, getProductById} from './product.controller.ts'
import { createProductSchema, getProductsSchema } from './product.schema.ts';
import { validate } from '@/middleware/validate.middleware.ts';

const router = Router();

router.get('/', validate(getProductsSchema), getAllProducts);
router.get('/:id', getProductById);
router.post('/', validate(createProductSchema), createProduct);

export default router;
