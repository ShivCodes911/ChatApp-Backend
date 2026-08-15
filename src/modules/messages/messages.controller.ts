import messageModel from "../../models/message.model.js";
import ConversationModel from "../../models/conversation.model.js";
import mongoose from "mongoose";

import type { Request, Response, NextFunction } from "express";

export const createMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Get current authenticated user
        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            });
        }

        // 2. Get conversation ID from URL
        const { conversationId } = req.params;

        // Express types req.params values as `string | string[]`.
        // Since our route contains only one `:conversationId`, we expect a single string.
        // Array.isArray() narrows the type and tells TypeScript that conversationId is definitely a string.


        if (!conversationId || Array.isArray(conversationId)) {
            return res.status(400).json({
                status: false,
             message: "Invalid conversation ID"
            });
        }

        // 3. Check that conversation exists
        // AND current user belongs to it
        const conversation = await ConversationModel.findOne({
            _id: conversationId,
            participants: currentUserId
        });

        if (!conversation) {
            return res.status(404).json({
                status: false,
                message: "Conversation not found"
            });
        }

        // 4. Get message content
        const { messageContent } = req.body;

        if (!messageContent) {
            return res.status(400).json({
                status: false,
                message: "Message content is required"
            });
        }

        // 5. Create message
        const message = await messageModel.create({
            conversation: new mongoose.Types.ObjectId(conversationId),
            sender: new mongoose.Types.ObjectId(currentUserId),
            content: messageContent
        });

        // 6. Return created message
        return res.status(201).json({
            status: true,
            message: "New message created successfully",
            data: message
        });

    } catch (error) {
        next(error);
    }
};