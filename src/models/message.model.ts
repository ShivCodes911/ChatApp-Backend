import mongoose from "mongoose";


interface IMessage{
    conversation:mongoose.Types.ObjectId;
    sender:mongoose.Types.ObjectId;
    content:string

};

const messageSchema = new mongoose.Schema<IMessage>({
    conversation:{type:mongoose.Schema.Types.ObjectId,ref:"Conversation",required:true},
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    content:{type:String,required:true}
},{
    timestamps:true
});

const messageModel = mongoose.model<IMessage>("Message",messageSchema);

export default messageModel;

