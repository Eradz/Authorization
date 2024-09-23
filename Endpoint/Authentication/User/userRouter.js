const express = require("express")
const route = express.Router()
const { getusers, signupUser, loginUser} = require('./userController')


route.get("/", getusers)
route.post("/signup", signupUser)
route.post("/login", loginUser)

module.exports = route
