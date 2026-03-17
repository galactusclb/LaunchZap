import { Request, Response } from "express";

import * as service from "./product.service.ts";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await service.doGetAllProducts();
    res.status(200).json({ success: true, data: products });
}