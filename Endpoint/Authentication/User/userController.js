const bcrypt = require("bcryptjs")
const {db} = require('../../../db')
const { sendCookies } = require("../../../utils/setCookies")
const jwt = require("jsonwebtoken")
const User = require("../../../Model/users")

//GET All users
const getusers = async(req,res)=>{
      const users = await db.select().from(User)
      res.status(200).json({message: users})
    }

// signup users
const signupUser = async(req,res)=>{
    const {email, password} = req.body
      try {  
          if(!email || !password){
                res.status(400).json({message: "Please fill all fields"})  
            } 
    const user =await db.select().from(User).where(eq(User.email, email));
    if(!user){
    const securePassword = await bcrypt.hash(password, 10)
    const user = await db.insert(User).values({ email, password: securePassword});
    res.status(201).json({message: "User Signup Successful"} )
    }else if(user){
      res.status(400).json({message:"User already exists"})
    }
        } catch (error) {
            console.log(error)
            res.status(400).json({message:error})
        }
}

// Login users
const loginUser = async(req,res) =>{
    const {email, password} = req.body
    try {
        const user =await db.select().from(User).where(eq(User.email, email));
        if(!user){
            res.status(400).json({message:"Invalid username or Password"})
        }else if(user && await bcrypt.compare(password, user.password)){
            const accessToken = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "30d"})
            sendCookies("accessToken", accessToken, res)
            res.status(200).json({message: `Login Successful, welcome`})
            console.log(accessToken)
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error})
    }
}

module.exports = {signupUser, getusers, loginUser}


