import dotenv from "dotenv"
import express from 'express';
import conncetDB from './db/index.js';

dotenv.config({
    path : './env'
})
const app = express()

conncetDB()




/*
( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error" , (error)=>{
            console.log("Errr :" , error);
            throw error
        })
            app.listen( process.env.PORT , ()=>{
                console.log(`App is listening on port ${process.env.PORT}`)
            })
    }
    catch(error){
        console.error("ERROR:" , EERROR)
        throw err
    }
})()
*/