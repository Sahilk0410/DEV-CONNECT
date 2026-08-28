import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())
app.use(express.json())


import userRouter from "./routes/user.route.js"

app.use("/api/v1/users", userRouter)

export { app }