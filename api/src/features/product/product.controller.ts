import { Request, Response } from "express";

import { CreateProduct, ProductFilterQuery } from "./product.schema.ts";
import * as service from "./product.service.ts";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    const result = await service.doGetAllProducts(req.validatedQuery as ProductFilterQuery);
    res.status(200).json({ success: true, ...result });
}

export const getProductById = async (req: Request, res: Response): Promise<void> =>{
    
}

export const createProduct = async (req: Request, res: Response): Promise<void> =>{
    const product = await service.doCreateProduct(req.body as CreateProduct);

    res.status(201).json({success: true, data: product})
}