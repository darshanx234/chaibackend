import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const conncetDB = async ()=>{
    try{
       const conncetionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n MongoDb connected !! DB HOST : ${conncetionInstance.connection.host} `);
    }
    catch(error){
        console.log("MONGODB Connction error" ,error);
        process.exit(1)
    }
}

export default conncetDB