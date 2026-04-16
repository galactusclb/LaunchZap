
import { Router } from 'express';

import { createProduct, getAllProducts, getProductById, toggleVote } from './product.controller.ts';
import { createProductSchema, getProductsSchema, voteProductSchema } from './product.schema.ts';

import { isAuth } from '@/middleware/auth.middleware.ts';
import { validate } from '@/middleware/validate.middleware.ts';

const router = Router();

router.get('/', validate(getProductsSchema), getAllProducts);
router.get('/:id', getProductById);
router.post('/', validate(createProductSchema), createProduct);
// router.put('/:id', validate(createProductSchema), updateProduct);
router.patch('/:id/vote', isAuth, validate(voteProductSchema) ,toggleVote);

export default router;
