
import * as repo from './product.repository.ts';

export const doGetAllProducts = async () => {
    return await repo.findAll();
}