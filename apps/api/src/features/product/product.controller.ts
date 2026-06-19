import { Request, Response } from 'express';

import { toProductDTO } from './product.dto.ts';
import {
    CreateProductInput,
    GetProductById,
    ProductFilterQuery,
    UpdateProductInput,
    VoteProduct,
} from './product.schema.ts';
import * as service from './product.service.ts';

import { requireAuth } from '@/middleware/auth.middleware.ts';
import { User } from '@/schemas/user.schema';
import { toCacheControlHeader } from '@/utils/constant/cache.ts';
import { constants } from '@/utils/constant/index.ts';
import { StatusCodes } from 'http-status-codes';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    const result = await service.doGetAllProducts(req.validatedQuery as ProductFilterQuery);
    const parsed = result.data?.map((item) => toProductDTO(item));

    res.header('Cache-Control', toCacheControlHeader(constants.cache.product.list));
    res.status(200).json({ success: true, meta: result.meta, data: parsed });
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as GetProductById;
    const product = await service.doGetById(id);

    res.header('Cache-Control', toCacheControlHeader(constants.cache.product.item));
    res.status(200).json({ success: true, data: toProductDTO(product) });
};

export const getProductPreviewById = async (req: Request, res: Response): Promise<void> => {
    const user = requireAuth(req);
    const { id: productId } = req.validatedParams as GetProductById;

    const previewProduct = await service.doGetProductPreviewById(user.id, productId);

    // prevented cdn cache; only browser cache
    res.header('Cache-Control', toCacheControlHeader(constants.cache.product.previewItem));
    res.status(StatusCodes.OK).json({ success: true, data: toProductDTO(previewProduct) });
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const user = requireAuth(req);

    const product = await service.doCreateProduct(user.id, req.validatedBody as CreateProductInput);

    res.status(201).json({ success: true, data: product });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const user = requireAuth(req);
    const { id: productId } = req.validatedParams as GetProductById;
    const input = req.validatedBody as UpdateProductInput;

    const updatedProduct = await service.doUpdateProduct(user.id, productId, input);

    res.status(StatusCodes.OK).json({ success: true, data: updatedProduct });
};

export const toggleVote = async (req: Request, res: Response) => {
    const { id: productId } = req.validatedParams as VoteProduct;
    const { id: userId } = req.user as User;

    const result = await service.doVoteProduct(userId, productId);
    res.status(200).json({
        success: true,
        isUpvoted: result.isUpvoted,
        message: `${productId} Product voted ${result.isUpvoted ? 'up' : 'remove'} successfully`,
    });
};
