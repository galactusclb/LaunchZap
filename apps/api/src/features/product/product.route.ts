import { Router } from 'express';

import { isAuth } from '@/middleware/auth.middleware.ts';
import { validate } from '@/middleware/validate.middleware.ts';

import { routes as launchRouter } from './launch/index.ts';
import {
    createProduct,
    getAllProducts,
    getProductById,
    getProductPreviewById,
    toggleVote,
    updateProduct,
} from './product.controller.ts';
import {
    createProductSchema,
    getProductByIdSchema,
    getProductsSchema,
    updateProductSchema,
    voteProductSchema,
} from './product.schema.ts';

const router = Router();

router.get('/', validate(getProductsSchema), getAllProducts);
router.get('/:id', validate(getProductByIdSchema), getProductById);
router.get('/:id/preview', isAuth, validate(getProductByIdSchema), getProductPreviewById);
router.post('/', isAuth, validate(createProductSchema), createProduct);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.patch('/:id/vote', isAuth, validate(voteProductSchema), toggleVote);

router.use('/:productId/launches', launchRouter);

export default router;
