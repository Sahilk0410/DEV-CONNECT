import express from "express"

const app = express()

app.get("/user", (req, res) => {
    res.send("user is logged in")
    console.log("user is loggen in")
})

app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})   