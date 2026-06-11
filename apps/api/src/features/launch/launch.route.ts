import { Router } from 'express';

import { validate } from '@/middleware/validate.middleware.ts';
import { isAuth } from '@/middleware/auth.middleware.ts';

import { createProduct, getAllProducts, getProductById, toggleVote } from './launch.controller.ts';

import {
    createProductSchema,
    getProductByIdSchema,
    getProductsSchema,
    voteProductSchema,
} from './launch.schema.ts';

const router = Router();

router.get('/', validate(getProductsSchema), getAllProducts);
router.get('/:id', validate(getProductByIdSchema), getProductById);
router.post('/', isAuth, validate(createProductSchema), createProduct);
// router.put('/:id', validate(createProductSchema), updateProduct);
router.patch('/:id/vote', isAuth, validate(voteProductSchema), toggleVote);

export default router;
