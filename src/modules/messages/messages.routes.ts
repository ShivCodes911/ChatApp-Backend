import express from "express";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";
import { createMessage } from "./messages.controller.js";

const router = express.Router();

router.post("/conversations/:conversationId/messages",userAuthMiddleware,createMessage);

export default router;