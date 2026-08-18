import express from "express";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";
import { createConversation, deleteConversation, getConversation } from "./conversation.controller.js";

const router  = express.Router();

router.post("/coversation",userAuthMiddleware,createConversation)
router.get("/conversation",userAuthMiddleware,getConversation)
router.delete("/conversations/:conversationId",userAuthMiddleware,deleteConversation);



export default router;