import { isAuth } from "@/middleware/auth.middleware";

import { Router } from "express";

import * as ctrl from "./user.controller";

const router = Router();

router.get("/me/votes", isAuth, ctrl.getVotedPosts);

export default router;