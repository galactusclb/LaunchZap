import { Router } from 'express';
import {createProduct, getAllProducts, getProductById} from './product.controller.ts'
import { createProductSchema } from './product.schema.ts';
import { validate } from '@/middleware/validate.middleware.ts';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', validate(createProductSchema), createProduct);

export default router;
