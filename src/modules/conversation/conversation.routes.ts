import express from "express";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";
import { createConversation, deleteConversation, getConversation, getConversationSummary, getSingleConversation } from "./conversation.controller.js";

const router  = express.Router();

router.post("/coversation",userAuthMiddleware,createConversation)
router.get("/conversation",userAuthMiddleware,getConversation)
router.delete("/conversations/:conversationId",userAuthMiddleware,deleteConversation);
router.get("/conversations/:conversationId", userAuthMiddleware, getSingleConversation);
router.get("/conversations",userAuthMiddleware,getConversationSummary);



export default router;