
import { Router } from "express";

import * as ctrl from "./user.controller";

import { isAuth } from "@/middleware/auth.middleware";

const router = Router();

router.get("/me/votes", isAuth, ctrl.getVotedPosts);

export default router;