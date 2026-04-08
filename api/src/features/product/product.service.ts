import { ConflictError } from '@/utils/errors/http-error.ts';

import * as repo from './product.repository.ts';
import { CreateProduct, ProductFilterQuery } from './product.schema.ts';
import { paginatedResponse } from '@/utils/paginate-helpers.ts';

export const doGetAllProducts = async (query: ProductFilterQuery) => {
    const {data, total} = await repo.findAll(query);
    return paginatedResponse(data, total, query);
}

export const doCreateProduct = async (input: CreateProduct) => {
    const isExist = await repo.findByName(input.name);

    if (isExist) throw new ConflictError("Product is already exist!");

    return await repo.createProduct(input);
}