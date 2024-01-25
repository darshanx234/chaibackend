import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
// app.use is used when configar to middleware in our application
app.use(cors({
    origin: process.env.CORS_ORIGIN, // allow our frontend to call our backend
    Credential: true
}))

app.use(express.json({ limit: "16kb" })) // handle the json data coming from frontend
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static("public"))

app.use(cookieParser())

export { app }

// hit url suppose instagram 