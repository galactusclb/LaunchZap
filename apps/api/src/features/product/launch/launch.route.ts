import { Router } from 'express';

import { isAuth } from '@/middleware/auth.middleware.ts';
import { validate } from '@/middleware/validate.middleware.ts';

import {
    getProductLaunces,
    getProductLaunchById,
    scheduleLaunch,
    toggleVote,
    updateLaunch,
} from './launch.controller.ts';
import {
    createLaunchSchema,
    getLaunchByIdSchema,
    getLaunchsSchema,
    updateLaunchSchema,
    voteLaunchSchema,
} from './launch.schema.ts';

const router = Router({ mergeParams: true });

router.get('/', validate(getLaunchsSchema), getProductLaunces);
router.get('/:id', validate(getLaunchByIdSchema), getProductLaunchById);
router.post('/', isAuth, validate(createLaunchSchema), scheduleLaunch);
router.put('/:id', isAuth, validate(updateLaunchSchema), updateLaunch);
router.patch('/:id/vote', isAuth, validate(voteLaunchSchema), toggleVote);

export default router;
