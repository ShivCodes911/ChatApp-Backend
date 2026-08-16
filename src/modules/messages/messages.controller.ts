import messageModel from "../../models/message.model.js";
import ConversationModel from "../../models/conversation.model.js";
import mongoose from "mongoose";

import type { Request, Response, NextFunction } from "express";
import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";

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


// GET /api/v1/conversations/:conversationId/messages


export const getAllMessage=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const currentUserId=req.user?.userId;

        const {page,limit}=req.query;

        const pageNumber =Number(page) || 1;
        const limitNumber =Number(limit) || 20;

        const skip=(pageNumber-1)*limitNumber;





        if(!currentUserId){
            return res.status(400).json({
                status:false,
                message:"Unauthorized"
            })
        };

        const {conversationId} = req.params;

        if(!conversationId || Array.isArray(conversationId)){
            return res.status(400).json({
                status:false,
                message:"ID not provided in Params"
            })
        };


        const conversation = await ConversationModel.findOne({
    _id: conversationId,
    participants: currentUserId
});


    if(!conversation){
        return res.status(404).json({
            status:false,
            message:"Conversation not found"
        })
    };

    const messages = await messageModel.find({
    conversation: conversationId
}).populate("sender","name email").sort({createdAt:1}).skip(skip).limit(limitNumber);

// 5. Check if conversation has no messages
        if (messages.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No messages found"
            });
        }
        return res.status(200).json({
            status:true,
            message:"Messages fetched successfully",
            data:messages,
            pagination:{
                page:pageNumber,
                limit:limitNumber
            }
        })
    } catch (error) {
        next(error);
        
    }
};

export const deleteMessage=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const currentUserId=req.user?.userId;

        if(!currentUserId){
            return res.status(400).json({
                status:false,
                message:"Unauthorized"
            })
        }

        const {conversationId,messageId}=req.params;

        if (!conversationId ||Array.isArray(conversationId) ||!messageId ||Array.isArray(messageId)) {
                return res.status(400).json({
        status: false,
        message: "Invalid conversation ID or message ID"
        });
    }


            const conversation = await ConversationModel.findOne({
                    _id: conversationId,
                participants: currentUserId
                    });

            if(!conversation){
                return res.status(404).json({
                    status:false,
                    messsage:"Conversation of this not found"
                })
            };


            const message=await messageModel.findOne({_id:messageId});

            if(!message){
                return res.status(404).json({
                    status:false,
                    message:"Message not found"
                })
            };

            if(message.sender.toString()!==currentUserId){
               return res.status(403).json({
        status: false,
        message: "You can only delete your own messages"
    });
            };


        await messageModel.deleteOne({
            _id:messageId,
            sender:currentUserId
        })

            return res.status(200).json({
                status:true,
                message:"message deleted successfully"
            })

 } catch (error) {
        next(error);
        
    }
}