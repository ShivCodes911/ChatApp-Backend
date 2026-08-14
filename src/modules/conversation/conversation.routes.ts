import express from "express";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";
import { createConversation, getConversation } from "./conversation.controller.js";

const router  = express.Router();

router.post("/",userAuthMiddleware,createConversation)
router.get("/",userAuthMiddleware,getConversation)


export default router;