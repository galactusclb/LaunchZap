import { Request, Response } from 'express';

import { User } from './user.schema';
import * as service from './user.service';

export const getVotedPosts = async (req: Request, res: Response) => {
    const user = req.user as User;

    const response = await service.doGetVotedProductsByUser(user.id);

    res.status(200).json({
        success: true,
        data: response,
    });
};
