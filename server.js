const express = require("express")
const app = express()
const userRouter = require("./Endpoint/Authentication/User/userRouter")
const {connectDB, db} = require("./db")
const PORT = 8080
const users = require("./Model/users")
require("dotenv").config()

connectDB()

app.use(express.json())
app.get('/', (req,res)=>{
    res.status(200).json({messae: "HELLO"})
})
app.use('/user', userRouter)


app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})