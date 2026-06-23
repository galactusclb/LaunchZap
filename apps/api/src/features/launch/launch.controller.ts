import { Request, Response } from 'express';

import { toCacheControlHeader } from '@/utils/constant/cache';
import { constants } from '@/utils/constant';

import { toLaunchDTO } from './launch.dto';
import { GetLaunchBySlug, LaunchFilterQuery } from './launch.schema';
import * as service from './launch.service';

export const getLaunches = async (req: Request, res: Response): Promise<void> => {
    const query = req.validatedQuery as LaunchFilterQuery;

    const result = await service.doGetLaunches(query);
    const parsed = result.data?.map((item) => toLaunchDTO(item));

    res.header('Cache-Control', toCacheControlHeader(constants.cache.product.list));
    res.status(200).json({ success: true, data: parsed, meta: result.meta });
};

export const getLaunchBySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.validatedParams as GetLaunchBySlug;

    const launch = await service.doGetLaunchBySlug(slug);

    res.header('Cache-Control', toCacheControlHeader(constants.cache.product.item));
    res.status(200).json({ success: true, data: toLaunchDTO(launch) });
};
