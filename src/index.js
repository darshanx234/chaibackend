import dotenv from "dotenv"
import express from 'express';
import conncetDB from './db/index.js';
import { registeruser } from "./controllers/user.controller.js";
import {app} from "./app.js";

dotenv.config({
    path : './.env'
})


conncetDB()
.then( ()=>{
    app.listen(process.env.PORT || 8000  , ()=>{
        console.log(` Server is running at port : ${process.env.PORT}`);

    })
})
.catch((err)=>{
    console.log("mongodb connction failed !!!");
})


// app.get("/register" , registeruser) // just testing purpoes line 

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