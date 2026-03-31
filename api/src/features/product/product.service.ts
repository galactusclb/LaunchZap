
import { ConflictError } from '@/utils/errors/http-error.ts';

import * as repo from './product.repository.ts';
import { CreateProduct } from './product.schema.ts';

export const doGetAllProducts = async () => {
    return await repo.findAll();
}

export const doCreateProduct = async (input: CreateProduct) => {
    const isExist = await repo.find({
        where: {
            name: input.name
        }
    })

    if (isExist) throw new ConflictError("Product is already exist!");

    return await repo.createProduct(input);
}