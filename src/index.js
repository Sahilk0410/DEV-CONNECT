import connectDB from "./db/db_connection.js"
import dotenv from "dotenv"
import { app } from "./app.js" 

dotenv.config({
    path: './.env'
})

connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port: ${process.env.PORT}`)
        
    })

    app.get("/users", (req,res) => {
        res.send("hello")
    })
} )
.catch( (error) => {
    console.log("mongoDB connection failed ", error)
} )