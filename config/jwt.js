const jwt=require('jsonwebtoken')
const cookie=require("cookie-parser")
const User=require("../model/usermodel")
const loginrequired=async(req,res,next)=>{
    const token=req.cookies["access-token"]
    if(token){
        const validatetoken =await jwt.verify(token,process.env.JWT_SECKRET)
    if(validatetoken){
        res.user=validatetoken.id
        next()
    }
    else{
        console.log("token expires")
        res.redirect("/user/login")
    }
}
    else{
        console.log("token not found")
        res.redirect('/user/login')
    }
}
const verifyEmail=async(req,res,next)=>{
    try{
     const user=await User.findOne({email:req.body.email})
     if(user.isverified){
        next()
     }
     else{
        console.log("please check your email to verify your account")
     }
    }
    catch{
        console.log(err)
    }

}

module.exports={loginrequired,verifyEmail}