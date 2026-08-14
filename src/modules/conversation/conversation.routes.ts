import express from "express";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";
import { createConversation } from "./conversation.controller.js";

const router  = express.Router();

router.post("/",userAuthMiddleware,createConversation)


export default router;