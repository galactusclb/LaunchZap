import { Request, Response } from 'express';

import { requireAuth } from '@/middleware/auth.middleware.ts';
import { toCacheControlHeader } from '@/utils/constant/cache.ts';
import { constants } from '@/utils/constant/index.ts';

import { toLaunchDTO } from './launch.dto.ts';
import {
    CreateLaunchInput,
    GetLaunchById,
    GetLaunchListParams,
    LaunchFilterQuery,
    UpdateLaunchInput,
    VoteLaunch,
} from './launch.schema.ts';
import * as service from './launch.service.ts';

export const getProductLaunces = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.validatedParams as GetLaunchListParams;
    const query = req.validatedQuery as LaunchFilterQuery;

    const result = await service.doGetProductLaunchList(productId, query);
    const parsed = result.data?.map((item) => toLaunchDTO(item));

    res.header('Cache-Control', toCacheControlHeader(constants.cache.product.list));
    res.status(200).json({ success: true, data: parsed, meta: result.meta });
};

export const getProductLaunchById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as GetLaunchById;
    const launch = await service.doGetLaunchById(id);

    res.header('Cache-Control', toCacheControlHeader(constants.cache.product.item));
    res.status(200).json({ success: true, data: toLaunchDTO(launch) });
};

export const scheduleLaunch = async (req: Request, res: Response): Promise<void> => {
    const user = requireAuth(req);
    const { productId } = req.validatedParams as GetLaunchById;
    const input = req.validatedBody as CreateLaunchInput;

    const product = await service.doScheduleLaunch(user.id, productId, input);

    res.status(201).json({ success: true, data: product });
};

export const updateLaunch = async (req: Request, res: Response): Promise<void> => {
    const user = requireAuth(req);
    const { id: launchId, productId } = req.validatedParams as GetLaunchById;
    const input = req.validatedBody as UpdateLaunchInput;

    const product = await service.doUpdateLaunch(user.id, productId, launchId, input);

    res.status(200).json({ success: true, data: product });
};

export const toggleVote = async (req: Request, res: Response) => {
    const user = requireAuth(req);
    const { id: launchId } = req.validatedParams as VoteLaunch;

    const result = await service.doVoteLaunch(user.id, launchId);
    res.status(200).json({
        success: true,
        isUpvoted: result.isUpvoted,
        message: `${launchId}: Launch voted ${result.isUpvoted ? 'up' : 'remove'} successfully`,
    });
};
