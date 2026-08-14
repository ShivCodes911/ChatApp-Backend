import ConversationModel from "../../models/conversation.model.js"
import userModel from "../../models/user.model.js";
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
}