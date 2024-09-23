const bcrypt = require("bcryptjs")
const {db} = require('../../../db')
const { sendCookies } = require("../../../utils/setCookies")
const jwt = require("jsonwebtoken")
const User = require("../../../Model/users")
const {eq} = require('drizzle-orm')
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
            const userExist =await db.select().from(User).where(eq(User.email, email));
            if(userExist.length <= 0){
            const securePassword = await bcrypt.hash(password, 10)
            await db.insert(User).values({ email, password: securePassword});
            res.status(201).json({message: "User Signup Successful"} )
            }else if(userExist.length > 0){
            res.status(400).json({message:"User Already exists"})
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

        console.log(user, await bcrypt.compare(password, user[0].password))
        // const passwordValidateIfUser = user[0]? await bcrypt.compare(password, user[0].password) ?
        if(user.length <= 0){
            res.status(400).json({message:"Invalid username or Password"})
        }else if(user.length > 0 && (await bcrypt.compare(password, user[0].password ) == false)){
            res.status(400).json({message:"Invalid username or Password"})
        }
        else if(user.length > 0 && await bcrypt.compare(password, user[0].password)){
            const accessToken = await jwt.sign({email}, "secret", {expiresIn: "30d"})
            sendCookies("accessToken", accessToken, res)
            res.status(200).json({message: `Login Successful, welcome`})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error})
    }
}

module.exports = {signupUser, getusers, loginUser}


