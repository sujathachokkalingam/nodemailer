const express=require("express")
const router=express.Router();
const mongoose=require("mongoose")
const User=require("../model/usermodel.js")
const crypto=require("crypto")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
const cookie=require('cookie-parser')

router.get("/login",(req,res)=>{
    res.render("login")
})
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECKRET)
}
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body
        const findUser=await User.findOne({email:email})
       if(findUser){
        const match=await bcrypt.compare(password,findUser.password)
        if(match){
            //create token
            const token=createToken(findUser.id)
            console.log(token)
           res.cookie('access-token',token)

        res.redirect('/homepage')
       }
       else{
        console.log("invalid password")
       }
    }
    else{
     console.log("User not registered")
    }
    }
    catch(err){
        console.log(err)
    }
     
});

//registration
router.get("/register",(req,res)=>{
    res.render("register")
})
//mail sender
var transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
    user:"sujathachokkalingam@gmail.com",
    pass:"*********"
},
tls:{
    rejectUnauthorized:false
}
})
router.post("/register",async(req,res)=>{
    try{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        emailToken:crypto.randomBytes(64).toString("hex"),
        isverified:false
    })
    const salt=await bcrypt.genSalt(10)
    const hashpassword=await bcrypt.hash(user.password,salt)
    user.password=hashpassword
    const newUser=await user.save()
    //verify send email
    var mailOption={
        from:'"verify your email"<sujathachokkalingam@gmail.com>',
        to:user.email,
        subject:"sujathachokkalingam-verify your email",
        html:`<h2>${user.name}.!thanks for registering on site</h2>
             <h4>please verify ur mail to continue.....</h4>
             <a href="http://${req.header.host}/user/verify-email?token=${user.emailToken}"verify your email</a>`
    }
    //sending mail
    transporter.sendMail(mailOption,(err,info)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log('verification email is sent to your gmail account')
        }
    })
    res.redirect("/user/login")
}
catch(err){
    console.log(err)
}
})
router.get("verify-email",async(req,res)=>{
    try{
        const token=req.query.token
        const user=await User.findOne({emailToken:token})
        if(user){
            user.emailToken=null
            user.isverified=true
            await user.save()
            res.redirect('user/login')
        }
        else{
            res.redirect('user/login')
            console.log("email is not verified")
        }
    }
    catch(err){
        console.log(err)
    }
})


module.exports=router;
