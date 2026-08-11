import app from "./app.js";
import connectDb from "./config/db.config.js";

import dotenv from "dotenv";


dotenv.config();


const PORT= Number(process.env.PORT) || 3000; // now need to write :number (inference takes care of it)


connectDb()
.then(()=>{
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})
}).catch((error)=>{
 console.error("Db connection failed ",error);
 process.exit(1);
})


