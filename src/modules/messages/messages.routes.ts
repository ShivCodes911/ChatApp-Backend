import express from "express";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";
import { createMessage, deleteMessage, editMessage, getAllMessage, markMessagesAsRead } from "./messages.controller.js";

const router = express.Router();

router.post("/conversations/:conversationId/messages",userAuthMiddleware,createMessage);
router.get("/conversations/:conversationId/messages",userAuthMiddleware,getAllMessage);
router.delete("/conversations/:conversationId/messages/:messageId",userAuthMiddleware,deleteMessage);
router.patch("/conversations/:conversationId/messages/read",userAuthMiddleware,markMessagesAsRead);
router.patch("/conversations/:conversationId/messages/:messageId",userAuthMiddleware,editMessage);


export default router;