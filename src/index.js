import dotenv from "dotenv"
import express from 'express';
import conncetDB from './db/index.js';

dotenv.config({
    path : './env'
})
const app = express()

conncetDB()
.then( ()=>{
    app.listen(process.env.PORT || 8000  , ()=>{
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongodb connction failed !!!");
})




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