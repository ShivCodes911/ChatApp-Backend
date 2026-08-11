import mongoose from "mongoose";
import type { connect } from "node:http2";

const connectDb=async()=>{
    try {
// confirm that env part is present , if not the execution stops there only 
          if(!process.env.MONGO_URI){
          throw new TypeError("error:provide the env varaible ");
        }



        const connectInstance  =await mongoose.connect(process.env.MONGO_URI);
        console.log(`The Db is succesfully connected✅:db host:${connectInstance.connection.host}`);

       
        
    } catch (error) {
        console.error("Failed to connect",error);
        process.exit(1);

        
    }
}

export default connectDb;