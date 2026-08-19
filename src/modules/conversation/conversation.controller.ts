import ConversationModel from "../../models/conversation.model.js"
import userModel from "../../models/user.model.js";

import messageModel from "../../models/message.model.js";
import type { Request,Response,NextFunction } from "express";




//api/v1/conversation/

export const createConversation=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const currentUserId =req.user?.userId;

        if(!currentUserId){
            return res.status(400).json({
                status:false,
                message:"User is not authorized"
            })
        };

        const UserId=req.body.userId;

        const otherUser=await userModel.findById(UserId);

        if(!otherUser){
            return res.status(404).json({
                status:false,
                message:"Other user not found"
            })
        };

        const conversation=await ConversationModel.create({
            participants:[currentUserId,otherUser._id]
        });

        return res.status(201).json({
            status:true,
            message:"Conversation created Successfully",
            conversation
        });
    } catch (error) {
        next(error);
        
    }
};




//api/v1/conversation

export const getConversation =async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const currentUserId=req.user?.userId;

        if(!currentUserId){
            return res.status(400).json({
            status:false,
            message:"unauthorized"
            })
        };

        const conversation=await ConversationModel.find({participants:currentUserId}).populate("participants","name email");

        if(!conversation || conversation.length===0){
            return res.status(404).json({
                status:false,
                message:"Conversation of User not found"
            })
        };

        return res.status(200).json({
            status:true,
            message:"This is the conversation of the current user",
            conversation
        })
    } catch (error) {
        next(error);
        
    }
};


export const deleteConversation = async (
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

        // 2. Get conversation ID from params
        const { conversationId } = req.params;

        if (!conversationId || Array.isArray(conversationId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid conversation ID"
            });
        }

        // 3. Check that the current user belongs to the conversation
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

        // 4. Delete all messages belonging to this conversation
        await messageModel.deleteMany({
            conversation: conversationId
        });

        // 5. Delete the conversation
        await ConversationModel.deleteOne({
            _id: conversationId
        });

        // 6. Return success
        return res.status(200).json({
            status: true,
            message: "Conversation deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};



export const getSingleConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Get authenticated user
        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            });
        }

        // 2. Get conversation ID from params
        const { conversationId } = req.params;

        if (!conversationId || Array.isArray(conversationId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid conversation ID"
            });
        }

        // 3. Find conversation and verify user belongs to it
        const conversation = await ConversationModel.findOne({
            _id: conversationId,
            participants: currentUserId
        }).populate("participants", "name email");

        // 4. Check conversation exists
        if (!conversation) {
            return res.status(404).json({
                status: false,
                message: "Conversation not found"
            });
        }

        // 5. Return conversation
        return res.status(200).json({
            status: true,
            message: "Conversation fetched successfully",
            data: conversation
        });

    } catch (error) {
        next(error);
    }
};

export const getConversationSummary = async (
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

        // 2. Get all conversations of current user
        const conversations = await ConversationModel.find({
            participants: currentUserId
        }).populate("participants", "name email");

        if (conversations.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No conversations found"
            });
        }

        // 3. Add last message and unread count
        const conversationData = await Promise.all(
            conversations.map(async (conversation) => {

                // Find latest message
                const lastMessage = await messageModel
                    .findOne({
                        conversation: conversation._id
                    })
                    .sort({ createdAt: -1 })
                    .select("content sender createdAt");

                // Count unread messages from other users
                const unreadCount = await messageModel.countDocuments({
                    conversation: conversation._id,
                    sender: { $ne: currentUserId },
                    isRead: false
                });

                return {
                    ...conversation.toObject(),
                    lastMessage,
                    unreadCount
                };
            })
        );

        // 4. Return conversations
        return res.status(200).json({
            status: true,
            message: "Conversations fetched successfully",
            data: conversationData
        });

    } catch (error) {
        next(error);
    }
};