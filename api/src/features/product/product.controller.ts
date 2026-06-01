import { Request, Response } from "express";

import { toProductDTO } from "./product.dto.ts";
import { CreateProduct, GetProductById, ProductFilterQuery, VoteProduct } from "./product.schema.ts";
import * as service from "./product.service.ts";

import { requireAuth } from "@/middleware/auth.middleware.ts";
import { User } from "@/schemas/user.schema";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    const result = await service.doGetAllProducts(req.validatedQuery as ProductFilterQuery);
    const parsed = result.data?.map((item)=>toProductDTO(item));
    res.status(200).json({ success: true, meta: result.meta, data: parsed });
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as GetProductById;
    const product = await service.doGetById(id);
    res.status(200).json({ success: true, data: toProductDTO(product) });
}

export const createProduct = async (req: Request, res: Response): Promise<void> =>{
    const user = requireAuth(req);

    const product = await service.doCreateProduct(user.id, req.validatedBody as CreateProduct);

    res.status(201).json({success: true, data: product})
}

export const toggleVote = async (req: Request, res: Response)=>{
    const {id: productId} = (req.validatedParams as VoteProduct);
    const {id: userId} = req.user as User

    const result = await service.doVoteProduct(userId, productId);
    res.status(200).json({success: true, isUpvoted: result.isUpvoted, message: `${productId} Product voted ${result.isUpvoted ? "up" : "remove"} successfully`})
}