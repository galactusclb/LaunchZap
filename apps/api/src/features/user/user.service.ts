import * as repo from './user.repository';
import { User } from './user.schema';

export const doGetVotedProductsByUser = async (userId: User['id']) => {
    return await repo.findVotedProductsByUser(userId);
};
