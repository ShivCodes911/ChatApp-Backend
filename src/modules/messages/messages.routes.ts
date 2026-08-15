import express from "express";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";
import { createMessage, getAllMessage } from "./messages.controller.js";

const router = express.Router();

router.post("/conversations/:conversationId/messages",userAuthMiddleware,createMessage);
router.get("/conversations/:conversationId/messages",userAuthMiddleware,getAllMessage);

export default router;