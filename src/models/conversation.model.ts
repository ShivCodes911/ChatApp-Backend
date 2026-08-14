import mongoose from "mongoose";

interface IConversation {
    participants:mongoose.Types.ObjectId[];
}

const ConversationSchema=new mongoose.Schema<IConversation>({ 
    
    //"This Mongoose schema should follow the structure of IConversation."
    
    participants:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        
    ],
},{
    timestamps:true
});

const ConversationModel=mongoose.model<IConversation>("Conversation",ConversationSchema);

export default ConversationModel;