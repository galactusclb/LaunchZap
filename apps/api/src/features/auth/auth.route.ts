import { Router } from 'express';

import { isAuth } from '@/middleware/auth.middleware.ts';

import authCtrl from './auth.controller.ts';

const router = Router();

router.get('/google/start', authCtrl.googleStart);
router.get('/google/callback', authCtrl.googleCallback);
router.get('/me', isAuth, authCtrl.me);
router.post('/refresh', authCtrl.refresh);
router.post('/logout', authCtrl.logout);

export default router;
