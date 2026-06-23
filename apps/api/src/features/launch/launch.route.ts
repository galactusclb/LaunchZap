import { Router } from 'express';

import { validate } from '@/middleware/validate.middleware';

import { getLaunches, getLaunchBySlug } from './launch.controller';
import { getLaunchesSchema, getLaunchBySlugSchema } from './launch.schema';

const router = Router();

router.get('/', validate(getLaunchesSchema), getLaunches);
router.get('/:slug', validate(getLaunchBySlugSchema), getLaunchBySlug);

export { router };
