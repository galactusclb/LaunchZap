import { User } from "../auth/auth.schema";

import * as repo from "./user.repository"

export const doGetVotedProductsByUser = async (userId: User["id"]) => {
    return await repo.findVotedProductsByUser(userId);
}